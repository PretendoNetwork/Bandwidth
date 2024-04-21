const Discord = require('discord.js');
const database = require('../database');

const previewRuleMenu = new Discord.StringSelectMenuBuilder();
previewRuleMenu.setCustomId('preview-rule-selection');
previewRuleMenu.setMaxValues(5);
previewRuleMenu.setPlaceholder('Select a rule to preview');

/**
 *
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function previewRuleHandler(interaction) {
	const { guildId } = interaction;
	const ruleId = interaction.values[0];

	const rule = await database.getRule(guildId, ruleId);

	const ruleEmbed = new Discord.EmbedBuilder();
	ruleEmbed.setColor(0x9D6FF3);
	ruleEmbed.setTitle(`Rule: ${rule.title}`);
	ruleEmbed.setFooter({
		text: `Here's a preview of what your rule looks like. Users are waiting ${rule.time} seconds.`
	});

	ruleEmbed.setDescription(rule.description);

	interaction.reply({
		embeds: [ruleEmbed],
		ephemeral: true
	});
}

module.exports = {
	name: previewRuleMenu.data.custom_id,
	select_menu: previewRuleMenu,
	handler: previewRuleHandler
};