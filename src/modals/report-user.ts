import discordTranscripts from 'discord-html-transcripts';
import { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { ModalHandler } from '@/types/general-types';
import type { GuildChannel, GuildMember, ModalSubmitInteraction } from 'discord.js';

const reason = new TextInputBuilder();
reason.setCustomId('reason');
reason.setLabel('Reason');
reason.setStyle(TextInputStyle.Paragraph);
reason.setRequired(true);

const transcriptCount = new TextInputBuilder();
transcriptCount.setCustomId('transcript-count');
transcriptCount.setLabel('Transcript');
transcriptCount.setStyle(TextInputStyle.Short);
transcriptCount.setPlaceholder('Number of messages to include. 0-100. Default 20');

const actionRow1 = new ActionRowBuilder<TextInputBuilder>();
actionRow1.addComponents(reason);

const actionRow2 = new ActionRowBuilder<TextInputBuilder>();
actionRow2.addComponents(transcriptCount);

const reportUserModal = new ModalBuilder();
reportUserModal.setCustomId('report-user');
reportUserModal.setTitle('Reporting User');
reportUserModal.addComponents(actionRow1, actionRow2);

async function reportUserHandler(interaction: ModalSubmitInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const parts = interaction.customId.split('-');
	const targetId = parts[2];
	const targetMember = await interaction.guild!.members.fetch(targetId);

	const reason = interaction.fields.getTextInputValue('reason').trim();
	let transcriptCount = parseInt(interaction.fields.getTextInputValue('transcript-count')?.trim());

	if (isNaN(transcriptCount)) {
		transcriptCount = 20;
	}

	const reportsChannelId = await getGuildSetting(interaction.guildId!, 'reports_channel_id');
	const channels = await interaction.guild!.channels.fetch();
	const reportsChannel = channels.find(channel => channel!.id === reportsChannelId);

	if (!reportsChannel || !reportsChannel.isSendable()) {
		throw new Error('Report failed to submit - channel not setup');
	}

	const reportEmbed = new EmbedBuilder();
	const reportingMember = interaction.member as GuildMember;

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
			value: `<@${reportingMember.id}>\n${reportingMember.id}`,
			inline: true
		},
		{
			name: 'Channel',
			value: `<#${interaction.channelId}>\n${(interaction.channel as GuildChannel).name}`,
			inline: true
		},
		{
			name: 'Reason',
			value: reason.substring(0, 1024)
		}
	);
	reportEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild!.iconURL() ?? undefined
	});
	reportEmbed.setTimestamp(Date.now());

	const transcript = await discordTranscripts.createTranscript(interaction.channel!, {
		limit: transcriptCount,
		poweredBy: false
	});

	const message = await reportsChannel.send({
		embeds: [reportEmbed],
		files: [transcript]
	});

	const transcriptButton = new ButtonBuilder();

	transcriptButton.setLabel('Download Transcript');
	transcriptButton.setStyle(ButtonStyle.Link);
	transcriptButton.setEmoji('📜');
	transcriptButton.setURL(message.attachments.first()!.url);

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(transcriptButton);

	await message.edit({
		components: [row],
		files: []
	});

	await interaction.editReply({
		content: 'Report Submitted'
	});
}

const handler: ModalHandler = {
	name: reportUserModal.data.custom_id!,
	modal: reportUserModal,
	handler: reportUserHandler
};

export default handler;
