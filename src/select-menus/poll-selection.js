const Discord = require('discord.js');
const database = require('../database');

const pollSelectMenu = new Discord.StringSelectMenuBuilder();
pollSelectMenu.setCustomId('poll-selection');
pollSelectMenu.setMaxValues(5);
pollSelectMenu.setPlaceholder('Select an option');

/**
 *
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function pollSelectHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const option = interaction.values[0];

	const voted = await database.votePoll(interaction.user.id, interaction.message.id, Number(option));

	if (voted === true) {
		await interaction.followUp({
			content: 'Your vote has been counted!',
			ephemeral: true
		});
	} else {
		await interaction.followUp({
			content: 'Sorry, you\'ve already voted on this poll!',
			ephemeral: true
		});
	}
}

module.exports = {
	name: pollSelectMenu.data.custom_id,
	select_menu: pollSelectMenu,
	handler: pollSelectHandler
};