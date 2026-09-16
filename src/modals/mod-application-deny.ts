import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { ModalHandler } from '@/types/general-types';
import type { GuildMemberRoleManager, ModalSubmitInteraction, ActionRow, ButtonComponent } from 'discord.js';

const reason = new TextInputBuilder();
reason.setCustomId('reason');
reason.setLabel('Reason for denying moderator application.');
reason.setStyle(TextInputStyle.Paragraph);
reason.setPlaceholder('Enter a reason for denying...');
reason.setRequired(false);

const actionRow = new ActionRowBuilder<TextInputBuilder>();
actionRow.addComponents(reason);

const denyModApplicationModal = new ModalBuilder();
denyModApplicationModal.setCustomId('deny-moderator-application');
denyModApplicationModal.setTitle('Deny moderator application');
denyModApplicationModal.addComponents(actionRow);

async function denyModApplicationHandler(interaction: ModalSubmitInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const adminRoleId = await getGuildSetting(interaction.guildId!, 'admin_role_id');
	if (!adminRoleId) {
		throw new Error('No admin role ID set!');
	}

	const headModRoleId = await getGuildSetting(interaction.guildId!, 'head_mod_role_id');
	if (!headModRoleId) {
		throw new Error('No head mod role ID set!');
	}

	const rolesCache = (interaction.member!.roles as GuildMemberRoleManager).cache;

	const hasAdminRole = rolesCache.get(adminRoleId);
	const hasHeadModRole = rolesCache.get(headModRoleId);

	if (!(hasAdminRole || hasHeadModRole)) {
		throw new Error('Only administrators and head mods have permission to accept/deny applications');
	}

	const message = interaction.message!;
	const modApplicationEmbed = new EmbedBuilder(message.embeds[0].toJSON());
	const rowOld = message.components[0] as ActionRow<ButtonComponent>;
	const [acceptButtonOld, denyButtonOld] = rowOld.components;

	modApplicationEmbed.setColor(0xF36F8A);
	modApplicationEmbed.setImage('attachment://denied-banner.png');
	modApplicationEmbed.setThumbnail('attachment://denied-icon.png');

	const acceptButtonNew = new ButtonBuilder(acceptButtonOld.toJSON());
	const denyButtonNew = new ButtonBuilder(denyButtonOld.toJSON());

	acceptButtonNew.setDisabled();
	denyButtonNew.setDisabled();

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(acceptButtonNew, denyButtonNew);

	const deniedApplicationEmbed = new EmbedBuilder();
	deniedApplicationEmbed.setColor(0xF36F8A);
	deniedApplicationEmbed.setTitle('Mod Application Denied');
	deniedApplicationEmbed.setDescription('Your moderator application has been denied.');
	deniedApplicationEmbed.setFields([{
		name: 'Reason',
		value: interaction.fields.getTextInputValue('reason') || 'No reason given.'
	}]);

	const applyingMember = await interaction.guild!.members.fetch(modApplicationEmbed.data.description!.match(/[0-9]+/)![0]);
	applyingMember.send({
		embeds: [deniedApplicationEmbed]
	}).catch(() => {});

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/denied-icon.png',
			__dirname + '/../images/denied-banner.png'
		]
	});

	await interaction.editReply({
		content: 'Denied mod application'
	});
}

const handler: ModalHandler = {
	name: denyModApplicationModal.data.custom_id!,
	modal: denyModApplicationModal,
	handler: denyModApplicationHandler
};

export default handler;
