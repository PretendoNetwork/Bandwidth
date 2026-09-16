import { MessageFlags, ModalBuilder } from 'discord.js';
import type { ModalHandler } from '@/types/general-types';
import type { MessagePayload, ModalSubmitInteraction } from 'discord.js';

const editMessageModal = new ModalBuilder();
editMessageModal.setCustomId('edit-message');
editMessageModal.setTitle('Edit message sent as Bandwidth');

async function editMessageHandler(interaction: ModalSubmitInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const messageId = interaction.fields.getTextInputValue('message-id').trim();
	const payload = interaction.fields.getTextInputValue('payload').trim();

	const message = await interaction.channel!.messages.fetch(messageId);
	const messagePayload = JSON.parse(payload) as MessagePayload;
	await message.edit(messagePayload);

	await interaction.editReply({
		content: 'Message Edited'
	});
}

const handler: ModalHandler = {
	name: editMessageModal.data.custom_id!,
	modal: editMessageModal,
	handler: editMessageHandler
};

export default handler;
