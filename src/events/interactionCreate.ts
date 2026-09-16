import { MessageFlags } from 'discord.js';
import buttonHandler from '@/handlers/button-handler';
import chatInputCommandHandler from '@/handlers/chat-input-command-handler';
import contextMenuHandler from '@/handlers/context-menu-handler';
import selectMenuHandler from '@/handlers/select-menu-handler';
import modalSubmitHandler from '@/handlers/modal-submit-handler';
import type { Interaction } from 'discord.js';

export default async function interactionCreateHandler(interaction: Interaction): Promise<void> {
	try {
		if (interaction.isChatInputCommand()) {
			await chatInputCommandHandler(interaction);
		}

		if (interaction.isButton()) {
			await buttonHandler(interaction);
		}

		if (interaction.isStringSelectMenu()) {
			await selectMenuHandler(interaction);
		}

		if (interaction.isContextMenuCommand()) {
			await contextMenuHandler(interaction);
		}

		if (interaction.isModalSubmit()) {
			await modalSubmitHandler(interaction);
		}
	} catch (error) {
		const content = error instanceof Error ? error.message : 'Missing error message';

		try {
			if (!interaction.isAutocomplete()) {
				if (interaction.replied || interaction.deferred) {
					await interaction.editReply({ content });
				} else {
					await interaction.reply({ content, flags: MessageFlags.Ephemeral });
				}
			}
			console.log(error);
		} catch (replyError) {
			console.log(replyError, error);
		}
	}
}
