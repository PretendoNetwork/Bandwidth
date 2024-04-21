const Discord = require('discord.js');
const database = require('../database');

const disableNLPButton = new Discord.ButtonBuilder();
disableNLPButton.setCustomId('disable-nlp');
disableNLPButton.setLabel('Disable Automatic Help');
disableNLPButton.setStyle(Discord.ButtonStyle.Danger);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function disableNLPHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const { guildId } = interaction;
	const memberId = interaction.member.id;

	const isHelpDisabled = await database.checkAutomaticHelpDisabled(guildId, memberId);

	if (isHelpDisabled) {
		await interaction.editReply({
			content: 'Automatic help is already disabled for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command',
			ephemeral: true
		});
	} else {
		await database.disableAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**disabled**_ for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command',
			ephemeral: true
		});
	}
}

module.exports = {
	name: disableNLPButton.data.custom_id,
	button: disableNLPButton,
	handler: disableNLPHandler
};