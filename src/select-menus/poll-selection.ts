import { MessageFlags, StringSelectMenuBuilder } from 'discord.js';
import { votePoll } from '@/database';
import type { SelectMenuHandler } from '@/types/general-types';
import type { StringSelectMenuInteraction } from 'discord.js';

const pollSelectMenu = new StringSelectMenuBuilder();
pollSelectMenu.setCustomId('poll-selection');
pollSelectMenu.setMaxValues(5);
pollSelectMenu.setPlaceholder('Select an option');

async function pollSelectHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const option = interaction.values[0];

	const voted = await votePoll(interaction.user.id, interaction.message.id, Number(option));

	if (voted) {
		await interaction.followUp({
			content: 'Your vote has been counted!',
			flags: MessageFlags.Ephemeral
		});
	} else {
		await interaction.followUp({
			content: 'Sorry, you\'ve already voted on this poll!',
			flags: MessageFlags.Ephemeral
		});
	}
}

const handler: SelectMenuHandler = {
	name: pollSelectMenu.data.custom_id!,
	select_menu: pollSelectMenu,
	handler: pollSelectHandler
};

export default handler;
