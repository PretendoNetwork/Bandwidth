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

	if (message.author.id !== interaction.client.user.id) {
		throw new Error('Can only manage Bandwidth messages with this command');
	}

	const messageJSON = message.toJSON();

	// Only take the properties we need
	const messagePayload = {
		content: messageJSON.content || null,
		embeds: messageJSON.embeds || [],
		attachments: messageJSON.attachments || [],
		components: messageJSON.components || []
	};

	const messageIdInput = new Discord.TextInputBuilder();
	messageIdInput.setCustomId('message-id');
	messageIdInput.setLabel('Message ID (DO NOT CHANGE)');
	messageIdInput.setStyle(Discord.TextInputStyle.Short);
	messageIdInput.setValue(targetId);
	messageIdInput.setRequired(true);

	const payload = new Discord.TextInputBuilder();
	payload.setCustomId('payload');
	payload.setStyle(Discord.TextInputStyle.Paragraph);
	payload.setLabel('Message Payload');
	payload.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
	payload.setValue(JSON.stringify(messagePayload, null, 4));
	payload.setRequired(true);

	const row1 = new Discord.ActionRowBuilder();
	row1.addComponents(messageIdInput);

	const row2 = new Discord.ActionRowBuilder();
	row2.addComponents(payload);

	const editMessageModal = new Discord.ModalBuilder();
	editMessageModal.setCustomId('edit-message');
	editMessageModal.setTitle('Edit message sent as Bandwidth');
	editMessageModal.setComponents(row1, row2);

	await interaction.showModal(editMessageModal, {
		client: interaction.client,
		interaction: interaction
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);
contextMenu.setName('Edit Bandwidth Message');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};