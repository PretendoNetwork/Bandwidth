const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function toggleroleHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const roleName = interaction.options.getString('role');
	const member = interaction.member;
	const guild = await interaction.guild.fetch();
	const roles = await guild.roles.fetch();
	const role = roles.find(role => role.name.toLowerCase() === roleName);

	if (!role) {
		await interaction.followUp({
			content: 'Unable to find the requested role. Contact and admin as soon as possible',
			ephemeral: true
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
		ephemeral: true
	});
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages);
command.setName('togglerole');
command.setDescription('Toggle user roles');
command.addStringOption(option => {
	option.setName('role');
	option.setDescription('Role to toggle');
	option.setRequired(true);
	option.addChoices(
		{ name: '@Updates', value: 'updates' },
		{ name: '@StreamPing', value: 'streamping' }
	);

	return option;
});

module.exports = {
	name: command.name,
	help: 'Toggle on/off a given user role.\n```\nUsage: /togglerole <role>\n```',
	handler: toggleroleHandler,
	deploy: command.toJSON(),
};