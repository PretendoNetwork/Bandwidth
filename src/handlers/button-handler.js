const Discord = require('discord.js');

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function buttonHandler(interaction) {
	const { customId } = interaction;

	/** @type {Discord.Collection} */
	const buttons = interaction.client.buttons;
	const button = buttons.find(button => customId.startsWith(button.name)); // hack to be able to append extra metadata to buttons

	// do nothing if no button
	if (!button) {
		throw new Error(`Missing button handler for \`${customId}\``);
	}

	// run the button
	await button.handler(interaction);
}

module.exports = buttonHandler;