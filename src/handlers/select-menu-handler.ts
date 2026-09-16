import type { StringSelectMenuInteraction } from 'discord.js';

export default async function selectMenuHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	const { customId } = interaction;

	const selectMenus = interaction.client.selectMenus;
	const selectMenu = selectMenus.find(selectMenu => customId.startsWith(selectMenu.name)); // hack to be able to append extra metadata to selections

	// do nothing if no selectMenu
	if (!selectMenu) {
		throw new Error(`Missing select menu handler for \`${customId}\``);
	}

	// run the selectMenu
	await selectMenu.handler(interaction);
}
