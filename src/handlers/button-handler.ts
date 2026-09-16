import type { ButtonInteraction } from 'discord.js';

export default async function buttonHandler(interaction: ButtonInteraction): Promise<void> {
	const { customId } = interaction;

	const buttons = interaction.client.buttons;
	const button = buttons.find(button => customId.startsWith(button.name)); // hack to be able to append extra metadata to buttons

	// do nothing if no button
	if (!button) {
		throw new Error(`Missing button handler for \`${customId}\``);
	}

	// run the button
	await button.handler(interaction);
}
