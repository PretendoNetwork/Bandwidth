import { StringSelectMenuBuilder, ActionRowBuilder, ModalBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import { createPoll } from '@/database';
import { getPollImage, PollStatus } from '@/utils/polls';
import type { ModalSubmitInteraction } from 'discord.js';
import type { ModalHandler } from '@/types/general-types';

const createPollModal = new ModalBuilder();
createPollModal.setCustomId('create-poll');
createPollModal.setTitle('Create a poll');

async function createPollHandler(interaction: ModalSubmitInteraction): Promise<void> {
	const parts = interaction.customId.split('-');
	const name = parts[2];
	const optionsCount = parseInt(parts[3]);
	const expiryTime = parts[4];

	const pollSelectMenu = new StringSelectMenuBuilder();
	pollSelectMenu.setCustomId('poll-selection');
	pollSelectMenu.setPlaceholder('Cast your vote...');

	const options: string[] = [];
	for (let i = 0; i < optionsCount; i++) {
		const optionText = interaction.fields.getTextInputValue(`poll-option-${i}`).trim();

		options.push(optionText);

		pollSelectMenu.addOptions({
			label: optionText,
			value: i.toString()
		});
	}

	const row = new ActionRowBuilder<StringSelectMenuBuilder>();
	row.addComponents(pollSelectMenu);

	await interaction.reply({
		components: [row]
	});

	const message = await interaction.fetchReply();

	await createPoll(interaction.guildId, message.id, message.channelId, name, expiryTime, options);
	const pollImage = await getPollImage(message.id, PollStatus.Initial);

	const attachment = new AttachmentBuilder(pollImage, {
		name: 'image.png'
	});

	await interaction.editReply({
		files: [attachment]
	});
}

const handler: ModalHandler = {
	name: createPollModal.data.custom_id!,
	modal: createPollModal,
	handler: createPollHandler
};

export default handler;
