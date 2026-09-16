import { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildSetting } from '@/database';
import acceptButtonHandler from '@/buttons/mod-application-accept';
import denyButtonHandler from '@/buttons/mod-application-deny';
import type { ModalHandler } from '@/types/general-types';
import type { ServerSettings } from '@/types/db-types';
import type { ButtonBuilder, GuildMember, ModalSubmitInteraction } from 'discord.js';

const acceptButton = acceptButtonHandler.button;
const denyButton = denyButtonHandler.button;

const priorExperience = new TextInputBuilder();
priorExperience.setCustomId('experience');
priorExperience.setLabel('Do you have prior experience and if so, what?');
priorExperience.setStyle(TextInputStyle.Short);
priorExperience.setRequired(true);

const timezone = new TextInputBuilder();
timezone.setCustomId('timezone');
timezone.setLabel('What is your timezone and availability?');
timezone.setStyle(TextInputStyle.Short);
timezone.setRequired(true);

const why = new TextInputBuilder();
why.setCustomId('why');
why.setLabel('Why do you want to become a moderator?');
why.setStyle(TextInputStyle.Short);
why.setRequired(true);

const pnid = new TextInputBuilder();
pnid.setCustomId('pnid');
pnid.setLabel('What is your PNID?');
pnid.setStyle(TextInputStyle.Short);
pnid.setRequired(true);

const extra = new TextInputBuilder();
extra.setCustomId('extra');
extra.setLabel('What else can you tell us about yourself?');
extra.setStyle(TextInputStyle.Paragraph);
extra.setRequired(true);

const actionRow1 = new ActionRowBuilder<TextInputBuilder>();
actionRow1.addComponents(priorExperience);

const actionRow2 = new ActionRowBuilder<TextInputBuilder>();
actionRow2.addComponents(timezone);

const actionRow3 = new ActionRowBuilder<TextInputBuilder>();
actionRow3.addComponents(why);

const actionRow4 = new ActionRowBuilder<TextInputBuilder>();
actionRow4.addComponents(pnid);

const actionRow5 = new ActionRowBuilder<TextInputBuilder>();
actionRow5.addComponents(extra);

const modApplicationModal = new ModalBuilder();
modApplicationModal.setCustomId('mod-application');
modApplicationModal.setTitle('Moderator Application');
modApplicationModal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);

async function modApplicationHandler(interaction: ModalSubmitInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const modType = interaction.customId.split('-').pop();
	const experience = interaction.fields.getTextInputValue('experience');
	const timezone = interaction.fields.getTextInputValue('timezone');
	const pnid = interaction.fields.getTextInputValue('pnid');
	const why = interaction.fields.getTextInputValue('why');
	const extra = interaction.fields.getTextInputValue('extra');

	const applyingMember = await (interaction.member as GuildMember).fetch();
	const guild = await interaction.guild!.fetch();

	let selectedDBItem: Exclude<keyof ServerSettings, 'ay_lmao_disabled'>;
	switch (modType) {
		case 'discord':
			selectedDBItem = 'mod_applications_channel_id';
			break;
		case 'vc':
			selectedDBItem = 'vc_mod_apps_channel_id';
			break;
		case 'forum':
			selectedDBItem = 'forum_mod_apps_channel_id';
			break;
		case 'network':
			selectedDBItem = 'network_mod_apps_channel_id';
			break;
		case 'juxt':
			selectedDBItem = 'juxt_mod_apps_channel_id';
			break;
		default:
			throw new Error(`application failed to submit - Unexpected modType ${modType} from interaction customId ${interaction.customId}`);
	}

	const channelId = await getGuildSetting(interaction.guildId!, selectedDBItem);
	const channel = channelId && await guild.channels.fetch(channelId);

	if (!channel || !channel.isSendable()) {
		throw new Error('application failed to submit - channel not setup!');
	}

	const modApplicationEmbed = new EmbedBuilder();

	modApplicationEmbed.setColor(0x9D6FF3);

	switch (modType) {
		case 'discord':
			modApplicationEmbed.setTitle('Discord Mod Application');
			break;
		case 'vc':
			modApplicationEmbed.setTitle('VC Mod Application');
			break;
		case 'forum':
			modApplicationEmbed.setTitle('Forum Mod Application');
			break;
		case 'network':
			modApplicationEmbed.setTitle('Network Mod Application');
			break;
		case 'juxt':
			modApplicationEmbed.setTitle('Juxt Mod Application');
			break;
	}
	modApplicationEmbed.setDescription(`<@${applyingMember.user.id}> has submitted a ${modType} moderator application`);
	modApplicationEmbed.setImage('attachment://pending-banner.png');
	modApplicationEmbed.setThumbnail('attachment://pending-icon.png');
	modApplicationEmbed.setAuthor({
		name: applyingMember.user.tag,
		iconURL: applyingMember.user.avatarURL() ?? undefined
	});
	modApplicationEmbed.setFields([
		{
			name: 'Do you have prior experience and if so, what?',
			value: experience
		},
		{
			name: 'What is your timezone and availability?',
			value: timezone
		},
		{
			name: 'Why do you want to become a moderator?',
			value: why
		},
		{
			name: 'What is your PNID?',
			value: pnid
		},
		{
			name: 'What else can you tell us about yourself?',
			value: extra
		}
	]);
	modApplicationEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: guild.iconURL() ?? undefined
	});
	modApplicationEmbed.setTimestamp(Date.now());

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(acceptButton, denyButton);

	await channel.send({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/pending-icon.png',
			__dirname + '/../images/pending-banner.png'
		]
	});

	await interaction.editReply({
		content: 'Application submitted!'
	});
}

const handler: ModalHandler = {
	name: modApplicationModal.data.custom_id!,
	cooldown: 1000 * 60 * 60 * 24 * 30, // ~ 1 month
	modal: modApplicationModal,
	handler: modApplicationHandler
};

export default handler;
