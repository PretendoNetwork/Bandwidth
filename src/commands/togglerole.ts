import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import type { CommandHandler } from '@/types/general-types';

async function toggleroleHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const roleName = interaction.options.getString('role');
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

	await interaction.followUp({
		content: `Toggling role ${role.name} [${hasRole ? 'REMOVED' : 'ADDED'}]!`,
		flags: MessageFlags.Ephemeral
	});
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
command.setName('togglerole');
command.setDescription('Toggle user roles');
command.addStringOption((option) => {
	option.setName('role');
	option.setDescription('Role to toggle');
	option.setRequired(true);
	option.addChoices(
		{ name: '@Updates', value: 'updates' },
		{ name: '@StreamPing', value: 'streamping' }
	);

	return option;
});

const handler: CommandHandler = {
	name: command.name,
	help: 'Toggle on/off a given user role.\n```\nUsage: /togglerole <role>\n```',
	handler: toggleroleHandler,
	deploy: command.toJSON()
};

export default handler;
