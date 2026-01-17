const Discord = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const database = require('../../database');

/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function warnPiracyHandler(interaction) {
	const reportsChannelId = await database.getGuildSetting(interaction.guildId, 'reports_channel_id');
	const channels = await interaction.guild.channels.fetch();
	const reportsChannel = channels.find(channel => channel.id === reportsChannelId);

	if (!reportsChannel) {
		throw new Error('Report failed to submit - channel not setup');
	}

	const warnPiracyEmbed = new Discord.EmbedBuilder();
	warnPiracyEmbed.setColor(0xF36F8A);
	warnPiracyEmbed.setThumbnail('attachment://piracy.png');
	warnPiracyEmbed.setTitle('Potential Piracy Reported');
	warnPiracyEmbed.setDescription('A user has flagged this message as potentially relating to piracy. Pretendo Network does not support piracy of any kind. Please review [Rule 5] (https://discord.com/channels/408718485913468928/982632532484972574/1444460663669002281).\n If you have questions, please ask moderators in a #modmail thread.');

	const message = await interaction.channel.messages.fetch(interaction.targetId);

	if (message.author.bot) {
		throw new Error('Cannot report bot messages');
	}

	const executor = await interaction.member.fetch();

	if (message.author.id === executor.user.id) {
		throw new Error('Cannot report own messages');
	}

	await message.reply({
		embeds: [warnPiracyEmbed],
		files: [
			__dirname + '/../../images/piracy.png'
		]
	});

	const reportEmbed = new Discord.EmbedBuilder();

	reportEmbed.setColor(0xF36F8A);
	reportEmbed.setTitle('User Report');
	reportEmbed.setDescription('――――――――――――――――――――――――――――――――――');
	reportEmbed.setFields(
		{
			name: 'Target User',
			value: `<@${message.author.id}>\n${message.author.id}`,
			inline: true
		},
		{
			name: 'Reporting User',
			value: `<@${interaction.member.id}>\n${interaction.member.id}`,
			inline: true
		},
		{
			name: 'Channel',
			value: `<#${interaction.channelId}>\n${interaction.channel.name}`,
			inline: true
		},
		{
			name: 'Reason',
			value: 'Piracy',
			inline: true
		},
		{
			name: 'Message',
			value: message.content.substring(0, 1024),
			inline: true
		}
	);
	reportEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild.iconURL()
	});
	reportEmbed.setTimestamp(Date.now());

	const jumpButton = new Discord.ButtonBuilder();

	jumpButton.setLabel('Jump!');
	jumpButton.setStyle(Discord.ButtonStyle.Link);
	jumpButton.setEmoji('📨');
	jumpButton.setURL(message.url);

	const row = new Discord.ActionRowBuilder();
	row.addComponents(jumpButton);

	await reportsChannel.send({
		components: [row],
		embeds: [reportEmbed]
	});

	await interaction.reply({
		content: 'Message Flagged',
		ephemeral: true
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages);
contextMenu.setName('Report Piracy');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	help: 'Report a message as relating to piracy. This action will be recorded with the information about yourself and the author of the message to prevent abuse.\n```\nUsage: Right click a message and navigate to \'Apps > Report Piracy\'\n```',
	handler: warnPiracyHandler,
	deploy: contextMenu.toJSON()
};
