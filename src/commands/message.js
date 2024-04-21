const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { modal: sendMessageModal } = require('../modals/send-message');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function messageHandler(interaction) {
	const action = interaction.options.getString('action');

	if (action === 'send') {
		await interaction.showModal(sendMessageModal, {
			client: interaction.client,
			interaction: interaction
		});
	} else if (action === 'edit') {
		const messageId = interaction.options.getString('message-id');

		if (!messageId) {
			throw new Error('Message ID is required for this action');
		}

		const message = await interaction.channel.messages.fetch(messageId);

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

		/*
			Make these components here to keep them in the right order
			and to set the default values
		*/


		const messageIdInput = new Discord.TextInputBuilder();
		messageIdInput.setCustomId('message-id');
		messageIdInput.setLabel('Message ID (DO NOT CHANGE)');
		messageIdInput.setStyle(Discord.TextInputStyle.Short);
		messageIdInput.setValue(messageId);
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
	} else if (action === 'get-payload') {
		const messageId = interaction.options.getString('message-id');

		if (!messageId) {
			if (!messageId) {
				throw new Error('Message ID is required for this action');
			}
		}

		const message = await interaction.channel.messages.fetch(messageId);

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
					name: 'message-payload.json'
				})
			],
			ephemeral: true
		});
	}
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);
command.setName('message');
command.setDescription('Send and manage Bandwidth messages');
command.addStringOption(option => {
	option.setName('action');
	option.setDescription('Action to make');
	option.setRequired(true);
	option.addChoices(
		{ name: 'Send Message', value: 'send' },
		{ name: 'Edit Message', value: 'edit' },
		{ name: 'Get Payload', value: 'get-payload' }
	);

	return option;
});

command.addStringOption(option => {
	option.setName('message-id');
	option.setDescription('Message ID');
	option.setRequired(false);

	return option;
});

module.exports = {
	name: command.name,
	handler: messageHandler,
	deploy: command.toJSON()
};