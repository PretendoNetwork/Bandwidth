const Discord = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const pollUtils = require('../../utils/polls');


/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function closePollHandler(interaction) {
	const { targetId } = interaction;

	const message = await interaction.channel.messages.fetch(targetId);

	pollUtils.closePoll(message);

	await interaction.reply({
		content: 'Poll closed!',
		ephemeral: true
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages);
contextMenu.setName('Close Poll');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	handler: closePollHandler,
	deploy: contextMenu.toJSON()
};