import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { checkForErrorCode } from '@/utils/errorCode';
import type { ButtonHandler } from '@/types/general-types';
import type { APIButtonComponentWithCustomId, ButtonInteraction } from 'discord.js';

const expandErrorButton = new ButtonBuilder();
expandErrorButton.setCustomId('expand');
expandErrorButton.setLabel('Expand Error Info');
expandErrorButton.setStyle(ButtonStyle.Primary);

async function expandErrorHandler(interaction: ButtonInteraction): Promise<void> {
	await interaction.deferUpdate();

	const { message } = interaction;
	const ogEmbed = message.embeds[0];
	const ogButton = message.components[0];

	// Grab that error code again
	const errorCodeEmbed = checkForErrorCode(message.embeds[0].title!)!;

	// Swap the embed out, while removing our button component
	await message.edit({
		embeds: [errorCodeEmbed],
		components: []
	});

	// Wait 45 seconds, enough time to read.
	await new Promise(r => setTimeout(r, 45000));

	// Re-collapse the message
	await message.edit({
		embeds: [ogEmbed],
		components: [ogButton]
	});
}

const handler: ButtonHandler = {
	name: (expandErrorButton.data as APIButtonComponentWithCustomId).custom_id,
	button: expandErrorButton,
	handler: expandErrorHandler
};

export default handler;
