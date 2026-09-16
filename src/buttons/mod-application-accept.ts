import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { ButtonHandler } from '@/types/general-types';
import type { ActionRow, APIButtonComponentWithCustomId, ButtonComponent, ButtonInteraction, GuildMember } from 'discord.js';

const acceptButton = new ButtonBuilder();
acceptButton.setCustomId('mod-application-accept');
acceptButton.setLabel('Accept');
acceptButton.setStyle(ButtonStyle.Success);

async function modApplicationAcceptHandler(interaction: ButtonInteraction): Promise<void> {
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

	const hasAdminRole = (interaction.member as GuildMember).roles.cache.get(adminRoleId);
	const hasHeadModRole = (interaction.member as GuildMember).roles.cache.get(headModRoleId);

	if (!(hasAdminRole || hasHeadModRole)) {
		throw new Error('Only administrators and head mods have permission to accept/deny applications');
	}

	const { message } = interaction;
	const modApplicationEmbed = new EmbedBuilder(message.embeds[0].toJSON());
	const rowOld = message.components[0] as ActionRow<ButtonComponent>;
	const [acceptButtonOld, denyButtonOld] = rowOld.components;

	modApplicationEmbed.setColor(0x6FF38E);
	modApplicationEmbed.setImage('attachment://accepted-banner.png');
	modApplicationEmbed.setThumbnail('attachment://accepted-icon.png');

	const acceptButtonNew = new ButtonBuilder(acceptButtonOld.toJSON());
	const denyButtonNew = new ButtonBuilder(denyButtonOld.toJSON());

	acceptButtonNew.setDisabled();
	denyButtonNew.setDisabled();

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(acceptButtonNew, denyButtonNew);

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/accepted-icon.png',
			__dirname + '/../images/accepted-banner.png'
		]
	});

	await interaction.editReply({
		content: 'Accepted mod application'
	});
}

const handler: ButtonHandler = {
	name: (acceptButton.data as APIButtonComponentWithCustomId).custom_id,
	button: acceptButton,
	handler: modApplicationAcceptHandler
};

export default handler;
