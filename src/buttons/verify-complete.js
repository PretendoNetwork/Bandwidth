const Discord = require('discord.js');
const database = require('../database');

const verifyCompleteButton = new Discord.ButtonBuilder();
verifyCompleteButton.setCustomId('verify-complete');
verifyCompleteButton.setLabel('Verify');
verifyCompleteButton.setStyle(Discord.ButtonStyle.Success);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function verifyCompleteHandler(interaction) {
	interaction.deferUpdate();

	try {
		const role = interaction.guild.roles.cache.get(await database.getGuildSetting(interaction.guildId, 'unverified_role_id'));
		interaction.member.roles.remove(role);
	} catch {
		// Do nothing, role is already removed
	}
}

module.exports = {
	name: verifyCompleteButton.data.custom_id,
	button: verifyCompleteButton,
	handler: verifyCompleteHandler
};