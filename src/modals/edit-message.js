const Discord = require('discord.js');

const editMessageModal = new Discord.ModalBuilder();
editMessageModal.setCustomId('edit-message');
editMessageModal.setTitle('Edit message sent as Bandwidth');

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function editMessageHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const messageId = interaction.fields.getTextInputValue('message-id').trim();
	const payload = interaction.fields.getTextInputValue('payload').trim();

	const message = await interaction.channel.messages.fetch(messageId);
	const messagePayload = JSON.parse(payload);
	await message.edit(messagePayload);

	await interaction.editReply({
		content: 'Message Edited',
		ephemeral: true
	});
}

module.exports = {
	name: editMessageModal.data.custom_id,
	modal: editMessageModal,
	handler: editMessageHandler
};