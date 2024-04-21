const Discord = require('discord.js');
const cooldownUtils = require('../utils/cooldown');


/**
 * 
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function modalSubmitHandler(interaction) {
	const { customId } = interaction;

	const modals = interaction.client.modals;
	const modal = modals.find(modal => customId.startsWith(modal.name)); // hack to be able to append extra metadata to modals
	const memberId = interaction.member.id;

	// do nothing if no modal
	if (!modal) {
		throw new Error(`Missing modal handler for \`${customId}\``);
	}

	// check for cooldown and run the modal
	const cooldown = await cooldownUtils.isInteractionOnCooldown(modal, memberId);
	if (!cooldown) {
		await modal.handler(interaction);
		if (modal.cooldown) {
			cooldownUtils.beginCooldown(modal, memberId);
		}
	} else {
		await interaction.reply(
			{
				embeds: [cooldown],
				ephemeral: true
			}
		);
	}
}

module.exports = modalSubmitHandler;