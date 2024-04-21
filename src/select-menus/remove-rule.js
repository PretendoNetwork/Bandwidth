const Discord = require('discord.js');
const database = require('../database');

const removeRuleMenu = new Discord.StringSelectMenuBuilder();
removeRuleMenu.setCustomId('remove-rule-selection');
removeRuleMenu.setMaxValues(5);
removeRuleMenu.setPlaceholder('Select a rule to remove');

/**
 *
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function removeRuleHandler(interaction) {
	const { guildId } = interaction;
	const ruleId = interaction.values[0];

	await database.removeRule(guildId, ruleId);

	interaction.reply({
		content: 'Rule removed!',
		ephemeral: true
	});
}

module.exports = {
	name: removeRuleMenu.data.custom_id,
	select_menu: removeRuleMenu,
	handler: removeRuleHandler
};