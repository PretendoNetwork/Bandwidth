const Discord = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');

/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function reportUserHandler(interaction) {
	const { targetId } = interaction;

	const message = await interaction.channel.messages.fetch(targetId);
	const messageJSON = message.toJSON();

	// Only take the properties we need
	const messagePayload = {
		content: messageJSON.content || null,
		embeds: messageJSON.embeds || [],
		attachments: messageJSON.attachments || [],
		components: messageJSON.components || []
	};

	await interaction.reply({
		content: 'Message Payload Attached',
		files: [
			new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(messagePayload)), {
				name:'message-payload.json'
			})
		],
		ephemeral: true
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);
contextMenu.setName('Get Message Payload');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};