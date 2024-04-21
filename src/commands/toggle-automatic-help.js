const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../database');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function toggleAutomaticHelpHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const { guildId } = interaction;
	const memberId = interaction.member.id;

	const isHelpDisabled = await database.checkAutomaticHelpDisabled(guildId, memberId);

	if (isHelpDisabled) {
		await database.enabledAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**enabled**_ for your account.\nTo disable automatic help, use the `/toggle-automatic-help` command',
			ephemeral: true
		});
	} else {
		await database.disableAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**disabled**_ for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command',
			ephemeral: true
		});
	}
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages);
command.setName('toggle-automatic-help');
command.setDescription('Toggle on/off Bandwidth\'s automatic help');

module.exports = {
	name: command.name,
	help: 'Toggle on/off Bandwidth\'s automatic help.\n```\nUsage: /toggle-automatic-help\n```',
	handler: toggleAutomaticHelpHandler,
	deploy: command.toJSON(),
};