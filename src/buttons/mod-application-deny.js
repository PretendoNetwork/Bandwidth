const Discord = require('discord.js');
const { modal: denyModApplicationModal } = require('../modals/mod-application-deny');

const denyButton = new Discord.ButtonBuilder();
denyButton.setCustomId('mod-application-deny');
denyButton.setLabel('Deny');
denyButton.setStyle(Discord.ButtonStyle.Danger);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function modApplicationDenyHandler(interaction) {
	interaction.showModal(denyModApplicationModal, {
		client: interaction.client,
		interaction: interaction
	});
}

module.exports = {
	name: denyButton.data.custom_id,
	button: denyButton,
	handler: modApplicationDenyHandler
};