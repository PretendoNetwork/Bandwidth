const Discord = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const database = require('../database');

const reason = new Discord.TextInputBuilder();
reason.setCustomId('reason');
reason.setLabel('Reason');
reason.setStyle(Discord.TextInputStyle.Paragraph);
reason.setRequired(true);

const transcriptCount = new Discord.TextInputBuilder();
transcriptCount.setCustomId('transcript-count');
transcriptCount.setLabel('Transcript');
transcriptCount.setStyle(Discord.TextInputStyle.Short);
transcriptCount.setPlaceholder('Number of messages to include. 0-100. Default 20');

const actionRow1 = new Discord.ActionRowBuilder();
actionRow1.addComponents(reason);

const actionRow2 = new Discord.ActionRowBuilder();
actionRow2.addComponents(transcriptCount);

const reportUserModal = new Discord.ModalBuilder();
reportUserModal.setCustomId('report-user');
reportUserModal.setTitle('Reporting User');
reportUserModal.addComponents(actionRow1, actionRow2);

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function reportUserHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const parts = interaction.customId.split('-');
	const targetId = parts[2];
	const targetMember = await interaction.guild.members.fetch(targetId);

	const reason = interaction.fields.getTextInputValue('reason').trim();
	let transcriptCount = interaction.fields.getTextInputValue('transcript-count')?.trim();

	if (transcriptCount === '' || isNaN(transcriptCount)) {
		transcriptCount = 20;
	} else {
		transcriptCount = parseInt(transcriptCount);
	}

	const reportsChannelId = await database.getGuildSetting(interaction.guildId, 'reports_channel_id');
	const channels = await interaction.guild.channels.fetch();
	const reportsChannel = channels.find(channel => channel.id === reportsChannelId);

	if (!reportsChannel) {
		throw new Error('Report failed to submit - channel not setup');
	}

	const reportEmbed = new Discord.EmbedBuilder();

	reportEmbed.setColor(0xF36F8A);
	reportEmbed.setTitle('User Report');
	reportEmbed.setDescription('――――――――――――――――――――――――――――――――――');
	reportEmbed.setFields(
		{
			name: 'Target User',
			value: `<@${targetMember.id}>\n${targetMember.id}`,
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
			value: reason.substring(0, 1024)
		}
	);
	reportEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild.iconURL()
	});
	reportEmbed.setTimestamp(Date.now());

	const transcript = await discordTranscripts.createTranscript(interaction.channel, {
		limit: transcriptCount,
		poweredBy: false
	});

	const message = await reportsChannel.send({
		embeds: [reportEmbed],
		files: [transcript]
	});

	const transcriptButton = new Discord.ButtonBuilder();

	transcriptButton.setLabel('Download Transcript');
	transcriptButton.setStyle(Discord.ButtonStyle.Link);
	transcriptButton.setEmoji('📜');
	transcriptButton.setURL(message.attachments.first().url);

	const row = new Discord.ActionRowBuilder();
	row.addComponents(transcriptButton);

	await message.edit({
		components: [row],
		files: []
	});

	await interaction.editReply({
		content: 'Report Submitted',
		ephemeral: true
	});
}

module.exports = {
	name: reportUserModal.data.custom_id,
	modal: reportUserModal,
	handler: reportUserHandler
};