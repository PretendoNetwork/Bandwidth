const Discord = require('discord.js');
const database = require('../database');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { modal: updateRuleModal } = require('../modals/update-rule');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function rulesHandler(interaction) {
	const { guildId } = interaction;
	//const ruleNumber = interaction.options.getInteger('rule-number');

	if (interaction.options.getSubcommand() === 'create') {
		interaction.showModal(updateRuleModal, {
			client: interaction.client,
			interaction: interaction
		});
		return;
	}

	if (['update', 'preview', 'remove'].includes(interaction.options.getSubcommand())) {
		const rules = await database.getAllRules(guildId);

		if (rules.length === 0) {
			await interaction.reply({
				content: 'There are no rules set. Use /rule create to make some.',
				ephemeral: true
			});
			return;
		}

		const ruleSelectMenu = new Discord.StringSelectMenuBuilder();
		ruleSelectMenu.setCustomId(`${interaction.options.getSubcommand()}-rule-selection`);
		ruleSelectMenu.setPlaceholder('Select a rule...');

		for (let i = 0; i < rules.length; i++) {
			ruleSelectMenu.addOptions({
				label: `#${i + 1}: ${rules[i].title}`,
				value: rules[i].id.toString(),
			});
		}

		const row = new Discord.ActionRowBuilder();
		row.addComponents(ruleSelectMenu);

		await interaction.reply({
			content: `Select a rule to ${interaction.options.getSubcommand()}...`,
			components: [row],
			ephemeral: true
		});

		return;
	}

	throw new Error('unhandled subcommand');
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);
command.setName('rule');
command.setDescription('Change options relating to rules');
command.addSubcommand((cmd) => {
	cmd.setName('create');
	cmd.setDescription('Create a rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('update');
	cmd.setDescription('Update an existing rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('preview');
	cmd.setDescription('View an existing rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('remove');
	cmd.setDescription('Remove a rule');
	return cmd;
});

module.exports = {
	name: command.name,
	help: 'Change rules of the bot',
	handler: rulesHandler,
	deploy: command.toJSON(),
};
