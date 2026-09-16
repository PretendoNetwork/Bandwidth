import {
	ActionRowBuilder,
	AttachmentBuilder,
	MessageFlags,
	ModalBuilder,
	PermissionFlagsBits,
	TextInputBuilder,
	TextInputStyle,
	SlashCommandBuilder
} from 'discord.js';
import sendMessageModalHandler from '@/modals/send-message';
import type { CommandHandler } from '@/types/general-types';
import type { ChatInputCommandInteraction } from 'discord.js';

const sendMessageModal = sendMessageModalHandler.modal;

async function messageHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	const action = interaction.options.getString('action');

	if (action === 'send') {
		await interaction.showModal(sendMessageModal);
	} else if (action === 'edit') {
		const messageId = interaction.options.getString('message-id');

		if (!messageId) {
			throw new Error('Message ID is required for this action');
		}

		const message = await interaction.channel!.messages.fetch(messageId);

		if (message.author.id !== interaction.client.user.id) {
			throw new Error('Can only manage Bandwidth messages with this command');
		}

		const messageJSON = message.toJSON() as Record<string, unknown>;

		// Only take the properties we need
		const messagePayload = JSON.stringify({
			content: messageJSON.content || null,
			embeds: messageJSON.embeds || [],
			attachments: messageJSON.attachments || [],
			components: messageJSON.components || []
		}, null, 4);

		/*
			Make these components here to keep them in the right order
			and to set the default values
		*/

		const messageIdInput = new TextInputBuilder();
		messageIdInput.setCustomId('message-id');
		messageIdInput.setLabel('Message ID (DO NOT CHANGE)');
		messageIdInput.setStyle(TextInputStyle.Short);
		messageIdInput.setValue(messageId);
		messageIdInput.setRequired(true);

		const payload = new TextInputBuilder();
		payload.setCustomId('payload');
		payload.setStyle(TextInputStyle.Paragraph);
		payload.setLabel('Message Payload');
		payload.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
		payload.setValue(messagePayload);
		payload.setRequired(true);

		const row1 = new ActionRowBuilder<TextInputBuilder>();
		row1.addComponents(messageIdInput);

		const row2 = new ActionRowBuilder<TextInputBuilder>();
		row2.addComponents(payload);

		const editMessageModal = new ModalBuilder();
		editMessageModal.setCustomId('edit-message');
		editMessageModal.setTitle('Edit message sent as Bandwidth');
		editMessageModal.setComponents(row1, row2);

		await interaction.showModal(editMessageModal);
	} else if (action === 'get-payload') {
		const messageId = interaction.options.getString('message-id');

		if (!messageId) {
			if (!messageId) {
				throw new Error('Message ID is required for this action');
			}
		}

		const message = await interaction.channel!.messages.fetch(messageId);

		const messageJSON = message.toJSON() as Record<string, unknown>;

		// Only take the properties we need
		const messagePayload = JSON.stringify({
			content: messageJSON.content || null,
			embeds: messageJSON.embeds || [],
			attachments: messageJSON.attachments || [],
			components: messageJSON.components || []
		});

		await interaction.reply({
			content: 'Message Payload Attached',
			files: [
				new AttachmentBuilder(Buffer.from(messagePayload), {
					name: 'message-payload.json'
				})
			],
			flags: MessageFlags.Ephemeral
		});
	}
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
command.setName('message');
command.setDescription('Send and manage Bandwidth messages');
command.addStringOption((option) => {
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

command.addStringOption((option) => {
	option.setName('message-id');
	option.setDescription('Message ID');
	option.setRequired(false);

	return option;
});

const handler: CommandHandler = {
	name: command.name,
	handler: messageHandler,
	deploy: command.toJSON()
};

export default handler;
