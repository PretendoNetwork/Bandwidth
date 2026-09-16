import { StringSelectMenuBuilder, ActionRowBuilder, MessageFlags } from 'discord.js';
import type { SelectMenuHandler } from '@/types/general-types';
import type { GuildMember, StringSelectMenuInteraction } from 'discord.js';

const roleSelectMenu = new StringSelectMenuBuilder();
roleSelectMenu.setCustomId('role-self-assign');
roleSelectMenu.setMaxValues(1);
roleSelectMenu.setPlaceholder('Select a role to toggle');
roleSelectMenu.addOptions([
	{
		label: '@Updates',
		description: 'Get pinged whenever important server announcements happen',
		value: 'updates'
	},
	{
		label: '@StreamPing',
		description: 'Get pinged whenever a new Twitch stream is beginning',
		value: 'streamping'
	}
]);

async function roleSelfAssignHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const roleName = interaction.values[0];
	const member = interaction.member as GuildMember;
	const guild = await interaction.guild!.fetch();
	const roles = await guild.roles.fetch();
	const role = roles.find(role => role.name.toLowerCase() === roleName);

	if (!role) {
		await interaction.followUp({
			content: 'Unable to find the requested role. Contact an admin as soon as possible',
			flags: MessageFlags.Ephemeral
		});

		return;
	}

	const hasRole = member.roles.cache.has(role.id);

	if (hasRole) {
		await member.roles.remove(role);
	} else {
		await member.roles.add(role);
	}

	const { message } = interaction;

	const row = new ActionRowBuilder<StringSelectMenuBuilder>();
	row.addComponents(roleSelectMenu);

	await message.edit({
		components: [row]
	});

	await interaction.followUp({
		content: `Toggling role ${role.name} [${hasRole ? 'REMOVED' : 'ADDED'}]!`,
		flags: MessageFlags.Ephemeral
	});
}

const handler: SelectMenuHandler = {
	name: roleSelectMenu.data.custom_id!,
	select_menu: roleSelectMenu,
	handler: roleSelfAssignHandler
};

export default handler;
