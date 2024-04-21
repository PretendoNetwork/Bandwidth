const Discord = require('discord.js');
const database = require('../database');

const confirmRuleUpdateButton = new Discord.ButtonBuilder();
confirmRuleUpdateButton.setCustomId('confirm-rule-update');
confirmRuleUpdateButton.setLabel('Update Rule');
confirmRuleUpdateButton.setStyle(Discord.ButtonStyle.Success);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function confirmRuleUpdateHandler(interaction) {
	const parts = interaction.customId.split('-');
	const id = Number(parts[3]);
	const title = parts[4];
	const time = parts[5];

	const description = interaction.message.embeds[0].description;

	if (id === 0) {
		await database.createRule(interaction.guildId, title, description, time);
	} else {
		await database.updateRule(interaction.guildId, id, title, description, time);
	}

	interaction.reply({
		content: 'Rule updated!',
		ephemeral: true
	});
}

module.exports = {
	name: confirmRuleUpdateButton.data.custom_id,
	button: confirmRuleUpdateButton,
	handler: confirmRuleUpdateHandler
};