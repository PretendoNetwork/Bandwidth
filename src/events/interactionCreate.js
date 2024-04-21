const Discord = require('discord.js');
const buttonHandler = require('../handlers/button-handler');
const chatInputCommandHandler = require('../handlers/chat-input-command-handler');
const contextMenuHandler = require('../handlers/context-menu-handler');
const selectMenuHandler = require('../handlers/select-menu-handler');
const modalSubmitHandler = require('../handlers/modal-submit-handler');

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function interactionCreateHander(interaction) {
	try {
		if (interaction.isChatInputCommand()) {
			await chatInputCommandHandler(interaction);
		}

		if (interaction.isButton()) {
			await buttonHandler(interaction);
		}

		if (interaction.isStringSelectMenu()) {
			await selectMenuHandler(interaction);
		}

		if (interaction.isContextMenuCommand()) {
			await contextMenuHandler(interaction);
		}

		if (interaction.isModalSubmit()) {
			await modalSubmitHandler(interaction);
		}
	} catch (error) {
		const payload = {
			content: error.message || 'Missing error message',
			ephemeral: true
		};

		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(payload);
			} else {
				await interaction.reply(payload);
			}
			console.log(error);
		} catch (replyError) {
			console.log(replyError, error);
		}
	}
}

module.exports = interactionCreateHander;