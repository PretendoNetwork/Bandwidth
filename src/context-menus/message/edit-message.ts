import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ApplicationCommandType, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { ContextMenuHandler } from '@/types/general-types';
import type { ContextMenuCommandInteraction } from 'discord.js';

async function reportUserHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const { targetId } = interaction;

	const message = await interaction.channel!.messages.fetch(targetId);

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

	const messageIdInput = new TextInputBuilder();
	messageIdInput.setCustomId('message-id');
	messageIdInput.setLabel('Message ID (DO NOT CHANGE)');
	messageIdInput.setStyle(TextInputStyle.Short);
	messageIdInput.setValue(targetId);
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
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
contextMenu.setName('Edit Bandwidth Message');
contextMenu.setType(ApplicationCommandType.Message);

const handler: ContextMenuHandler = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};

export default handler;
