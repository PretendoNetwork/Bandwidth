const Discord = require('discord.js');

const payloadTextInput = new Discord.TextInputBuilder();
payloadTextInput.setCustomId('payload');
payloadTextInput.setStyle(Discord.TextInputStyle.Paragraph);
payloadTextInput.setLabel('Message Payload');
payloadTextInput.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
payloadTextInput.setValue('{\n\t"content": null,\n\t"embeds": [],\n\t"attachments": [],\n\t"components": []\n}');
payloadTextInput.setRequired(true);

const actionRow = new Discord.ActionRowBuilder();
actionRow.addComponents(payloadTextInput);

const sendMessageModal = new Discord.ModalBuilder();
sendMessageModal.setCustomId('send-message');
sendMessageModal.setTitle('Send message as Bandwidth');
sendMessageModal.addComponents(actionRow);

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function sendMessageHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const payload = interaction.fields.getTextInputValue('payload').trim();

	const messagePayload = JSON.parse(payload);
	await interaction.channel.send(messagePayload);

	await interaction.editReply({
		content: 'Message Sent',
		ephemeral: true
	});
}

module.exports = {
	name: sendMessageModal.data.custom_id,
	modal: sendMessageModal,
	handler: sendMessageHandler
};