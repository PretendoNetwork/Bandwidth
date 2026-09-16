import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { ContextMenuCommandInteraction, GuildChannel, GuildMember } from 'discord.js';
import type { ContextMenuHandler } from '@/types/general-types';

async function warnPiracyHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const reportsChannelId = await getGuildSetting(interaction.guildId!, 'reports_channel_id');
	const channels = await interaction.guild!.channels.fetch();
	const reportsChannel = channels.find(channel => channel!.id === reportsChannelId);

	if (!reportsChannel || !reportsChannel.isSendable()) {
		throw new Error('Report failed to submit - channel not setup');
	}

	const warnPiracyEmbed = new EmbedBuilder();
	warnPiracyEmbed.setColor(0xF36F8A);
	warnPiracyEmbed.setTitle('Potential Piracy Reported');
	warnPiracyEmbed.setDescription('A user has flagged this message as potentially relating to piracy. Pretendo Network does not support piracy of any kind. Please review [Rule 5](https://discord.com/channels/408718485913468928/982632532484972574/1444460663669002281).\n\nIf you have any questions, please ask moderators in a <#1370584407261581392> thread.');

	const message = await interaction.channel!.messages.fetch(interaction.targetId);

	if (message.author.bot) {
		throw new Error('Cannot report bot messages');
	}

	const executor = await (interaction.member as GuildMember).fetch();

	if (message.author.id === executor.user.id) {
		throw new Error('Cannot report own messages');
	}

	await message.reply({
		embeds: [warnPiracyEmbed]
	});

	const reportEmbed = new EmbedBuilder();

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
			value: `<@${executor.id}>\n${executor.id}`,
			inline: true
		},
		{
			name: 'Channel',
			value: `<#${interaction.channelId}>\n${(interaction.channel as GuildChannel).name}`,
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
		iconURL: interaction.guild!.iconURL() ?? undefined
	});
	reportEmbed.setTimestamp(Date.now());

	const jumpButton = new ButtonBuilder();

	jumpButton.setLabel('Jump!');
	jumpButton.setStyle(ButtonStyle.Link);
	jumpButton.setEmoji('📨');
	jumpButton.setURL(message.url);

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(jumpButton);

	await reportsChannel.send({
		components: [row],
		embeds: [reportEmbed]
	});

	await interaction.reply({
		content: 'Message Flagged',
		flags: MessageFlags.Ephemeral
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
contextMenu.setName('Report Piracy');
contextMenu.setType(ApplicationCommandType.Message);

const handler: ContextMenuHandler = {
	name: contextMenu.name,
	help: 'Report a message as relating to piracy. This action will be recorded with the information about yourself and the author of the message to prevent abuse.\n```\nUsage: Right click a message and navigate to \'Apps > Report Piracy\'\n```',
	handler: warnPiracyHandler,
	deploy: contextMenu.toJSON()
};

export default handler;
