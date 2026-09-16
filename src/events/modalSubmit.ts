import { MessageFlags } from 'discord.js';
import type { ModalSubmitInteraction } from 'discord.js';

async function modalSubmitHandler(interaction: ModalSubmitInteraction): Promise<void> {
	try {
		const { customId } = interaction;

		const modals = interaction.client.modals;
		const modal = modals.find(modal => customId.startsWith(modal.name)); // hack to be able to append extra metadata to modals

		// do nothing if no modal
		if (!modal) {
			await interaction.reply(`Missing modal handler for \`${customId}\``);
			return;
		}

		// run the modal
		await modal.handler(interaction);
	} catch (error) {
		const content = error instanceof Error ? error.message : 'Missing error message';

		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ content });
			} else {
				await interaction.reply({ content, flags: MessageFlags.Ephemeral });
			}

			console.log(error);
		} catch (replyError) {
			console.log(replyError, error);
		}
	}
}

export default modalSubmitHandler;
