const Discord = require('discord.js');
const errorCodeUtils = require('../utils/errorCode');

const expandErrorButton = new Discord.ButtonBuilder();
expandErrorButton.setCustomId('expand');
expandErrorButton.setLabel('Expand Error Info');
expandErrorButton.setStyle(Discord.ButtonStyle.Primary);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function expandErrorHandler(interaction) {    
	interaction.deferUpdate();

	const { message } = interaction;
	const ogEmbed = message.embeds[0];
	const ogButton = message.components[0];

	// Grab that error code again
	const errorCodeEmbed = errorCodeUtils.checkForErrorCode(message.embeds[0].title);

	// Swap the embed out, while removing our button component
	message.edit({
		embeds: [errorCodeEmbed],
		components: []
	});

	// Wait 45 seconds, enough time to read.
	await new Promise(r => setTimeout(r, 45000));

	// Re-collapse the message
	message.edit({
		embeds: [ogEmbed],
		components: [ogButton]
	});
}

module.exports = {
	name: expandErrorButton.data.custom_id,
	button: expandErrorButton,
	handler: expandErrorHandler
};