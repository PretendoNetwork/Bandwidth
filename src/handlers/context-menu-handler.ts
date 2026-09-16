import type { ContextMenuCommandInteraction } from 'discord.js';

export default async function contextMenuHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const { commandName } = interaction;

	const contextMenus = interaction.client.contextMenus;
	const contextMenu = contextMenus.get(commandName);

	// do nothing if no contextMenu
	if (!contextMenu) {
		throw new Error(`Missing context menu handler for \`${commandName}\``);
	}

	// run the contextMenu
	await contextMenu.handler(interaction);
}
