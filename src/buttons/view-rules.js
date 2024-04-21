const Discord = require('discord.js');
const database = require('../database');
const { button: verifyCompleteButton } = require('./verify-complete');


const viewRulesButton = new Discord.ButtonBuilder();
viewRulesButton.setCustomId('view-rules');
viewRulesButton.setLabel('View Rules');
viewRulesButton.setStyle(Discord.ButtonStyle.Primary);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function viewRulesHandler(interaction) {
	const parts = interaction.customId.split('-');
	const ruleId = Number(parts[2]) || 0;

	const rules = await database.getAllRules(interaction.guildId);
	const rule = rules[ruleId];

	const nextButton = new Discord.ButtonBuilder();
	nextButton.setCustomId(`view-rules-${ruleId + 1}`);
	nextButton.setLabel('Next');
	nextButton.setStyle('Primary');
	nextButton.setEmoji('⏩');
	nextButton.setDisabled(false);

	const row = new Discord.ActionRowBuilder();
	row.addComponents(nextButton);

	if (rules.length === 0) {
		row.setComponents(verifyCompleteButton);
		await interaction.reply({
			content: 'No rules are set, press Verify to continue.',
			components: [row],
			ephemeral: true
		});
		return;
	}

	const ruleEmbed = new Discord.EmbedBuilder();
	ruleEmbed.setColor(0x9D6FF3);
	ruleEmbed.setTitle(`Rule ${ruleId + 1}: ${rule.title}`);
	ruleEmbed.setDescription(rule.description);

	if (ruleId === 0) {
		await interaction.reply({
			embeds: [ruleEmbed],
			components: [row],
			ephemeral: true
		});
	} else {
		await interaction.update({
			embeds: [ruleEmbed],
			components: [row],
			ephemeral: true
		});
	}

	let time = rule.time;
	if (time !== 0) {
		const timer = setInterval(function countdown() {
			nextButton.setLabel(time === 0 ? 'Next' : `Next (${time})`);
			nextButton.setDisabled(time === 0 ? false : true);
			time -= 1;

			row.setComponents(nextButton);

			if(time === -1) { 
				clearInterval(timer);
				if (rules[ruleId + 1] === undefined) {
					row.setComponents(verifyCompleteButton);
					interaction.editReply({components: [row]});
				}
			}

			interaction.editReply({components: [row]});
			return countdown;
		}(), 1000);
	} else {
		if (rules[ruleId + 1] === undefined) {
			row.setComponents(verifyCompleteButton);
			interaction.editReply({components: [row]});
		}
	}
}

module.exports = {
	name: viewRulesButton.data.custom_id,
	button: viewRulesButton,
	handler: viewRulesHandler
};