import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { CommandHandler } from '@/types/general-types';
import type { ChatInputCommandInteraction } from 'discord.js';

async function pollHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	const name = interaction.options.getString('name');
	const optionsCount = interaction.options.getInteger('options-count')!;
	const expiryTime = interaction.options.getInteger('expiry-time') || 0;

	const createPollModal = new ModalBuilder();
	createPollModal.setCustomId(`create-poll-${name}-${optionsCount}-${expiryTime}`);
	createPollModal.setTitle('Create a poll');

	for (let i = 0; i < optionsCount; i++) {
		const optionTextInput = new TextInputBuilder();
		optionTextInput.setCustomId(`poll-option-${i}`);
		optionTextInput.setStyle(TextInputStyle.Short);
		optionTextInput.setLabel(`Option ${i + 1}`);
		optionTextInput.setPlaceholder('Option text');
		optionTextInput.setMaxLength(55);

		const optionActionRow = new ActionRowBuilder<TextInputBuilder>();
		optionActionRow.addComponents(optionTextInput);

		createPollModal.addComponents(optionActionRow);
	}

	await interaction.showModal(createPollModal);
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
command.setName('poll');
command.setDescription('Create a new poll');
command.addStringOption((option) => {
	option.setName('name');
	option.setDescription('question for poll');
	option.setRequired(true);
	option.setMaxLength(80);
	return option;
});
command.addIntegerOption((option) => {
	option.setName('options-count');
	option.setDescription('amount of options for poll');
	option.setRequired(true);
	option.setMinValue(2);
	option.setMaxValue(5);
	return option;
});
command.addIntegerOption((option) => {
	option.setName('expiry-time');
	option.setDescription('expiry time in unix time to seconds');
	option.setRequired(false);
	return option;
});

const handler: CommandHandler = {
	name: command.name,
	help: 'Edit polls',
	handler: pollHandler,
	deploy: command.toJSON()
};

export default handler;
