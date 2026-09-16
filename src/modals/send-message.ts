import { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, MessageFlags } from 'discord.js';
import type { ModalHandler } from '@/types/general-types';
import type { MessageCreateOptions, ModalSubmitInteraction, SendableChannels } from 'discord.js';

const payloadTextInput = new TextInputBuilder();
payloadTextInput.setCustomId('payload');
payloadTextInput.setStyle(TextInputStyle.Paragraph);
payloadTextInput.setLabel('Message Payload');
payloadTextInput.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
payloadTextInput.setValue('{\n\t"content": null,\n\t"embeds": [],\n\t"attachments": [],\n\t"components": []\n}');
payloadTextInput.setRequired(true);

const actionRow = new ActionRowBuilder<TextInputBuilder>();
actionRow.addComponents(payloadTextInput);

const sendMessageModal = new ModalBuilder();
sendMessageModal.setCustomId('send-message');
sendMessageModal.setTitle('Send message as Bandwidth');
sendMessageModal.addComponents(actionRow);

async function sendMessageHandler(interaction: ModalSubmitInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const payload = interaction.fields.getTextInputValue('payload').trim();

	const messagePayload = JSON.parse(payload) as MessageCreateOptions;
	await (interaction.channel as SendableChannels).send(messagePayload);

	await interaction.editReply({
		content: 'Message Sent'
	});
}

const handler: ModalHandler = {
	name: sendMessageModal.data.custom_id!,
	modal: sendMessageModal,
	handler: sendMessageHandler
};

export default handler;
