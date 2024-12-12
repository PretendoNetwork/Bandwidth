const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { modal: modApplicationModal } = require('../modals/mod-application');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function modApplicationHandler(interaction) {
	modApplicationModal.setCustomId("mod-application-" + interaction.options.get('role').value);
	
	interaction.showModal(modApplicationModal, {
		client: interaction.client,
		interaction: interaction
	});
}

const command = new SlashCommandBuilder()
	.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages)
	.setName('mod-application')
	.setDescription('Apply for a position as a moderator.')
	.addStringOption(option =>
		option.setName('role')
			.setDescription('Moderator type to apply to.')
			.setRequired(true)
			.addChoices(
				{ name: 'Discord Moderator', value: 'discord' },
				{ name: 'Discord VC Moderator', value: 'vc' },
				{ name: 'Forum Moderator', value: 'forum' },
				{ name: 'Network Moderator', value: 'network' },
				{ name: 'Juxtaposition Moderator', value: 'juxt' }
			));

module.exports = {
	name: command.name,
	help: 'Displays a popup modal to apply for a moderator position.\n```\nUsage: /mod-application role\n```',
	handler: modApplicationHandler,
	deploy: command.toJSON()
};