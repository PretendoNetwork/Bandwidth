const Discord = require('discord.js');
const database = require('../database');
const pollUtils = require('../utils/polls');
const { StringSelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders');

const createPollModal = new Discord.ModalBuilder();
createPollModal.setCustomId('create-poll');
createPollModal.setTitle('Create a poll');

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function createPollHandler(interaction) {
	const parts = interaction.customId.split('-');
	const name = parts[2];
	const optionsCount = parts[3];
	const expiryTime = parts[4];


	const pollSelectMenu = new StringSelectMenuBuilder();
	pollSelectMenu.setCustomId('poll-selection');
	pollSelectMenu.setPlaceholder('Cast your vote...');

	const options = [];
	for (let i = 0; i < optionsCount; i++) {
		const optionText = interaction.fields.getTextInputValue(`poll-option-${i}`).trim();

		options.push(optionText);

		pollSelectMenu.addOptions({
			label: optionText,
			value: i.toString(),
		});
	}

	const row = new ActionRowBuilder();
	row.addComponents(pollSelectMenu);

	await interaction.reply({
		components: [row]
	});

	const message = await interaction.fetchReply();

	await database.createPoll(interaction.guildId, message.id, message.channelId, name, expiryTime, options);
	const pollImage = await pollUtils.getPollImage(message.id, pollUtils.PollStatus.Initial);

	const attachment = new Discord.AttachmentBuilder(pollImage, {
		name: 'image.png',
	});

	interaction.editReply({
		files: [attachment]
	});
}

module.exports = {
	name: createPollModal.data.custom_id,
	modal: createPollModal,
	handler: createPollHandler
};