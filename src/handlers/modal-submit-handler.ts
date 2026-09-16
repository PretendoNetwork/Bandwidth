import { MessageFlags } from 'discord.js';
import { isInteractionOnCooldown, beginCooldown } from '@/utils/cooldown';
import type { GuildMember, ModalSubmitInteraction } from 'discord.js';

export default async function modalSubmitHandler(interaction: ModalSubmitInteraction): Promise<void> {
	const { customId } = interaction;

	const modals = interaction.client.modals;
	const modal = modals.find(modal => customId.startsWith(modal.name)); // hack to be able to append extra metadata to modals
	const memberId = (interaction.member as GuildMember).id;

	// do nothing if no modal
	if (!modal) {
		throw new Error(`Missing modal handler for \`${customId}\``);
	}

	// check for cooldown and run the modal
	const cooldown = await isInteractionOnCooldown(modal, memberId);
	if (!cooldown) {
		await modal.handler(interaction);

		await beginCooldown(modal, memberId);
	} else {
		await interaction.reply(
			{
				embeds: [cooldown],
				flags: MessageFlags.Ephemeral
			}
		);
	}
}
