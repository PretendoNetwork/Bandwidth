import { ButtonBuilder, ButtonStyle } from 'discord.js';
import denyModApplicationModalHandler from '@/modals/mod-application-deny';
import type { ButtonHandler } from '@/types/general-types';
import type { APIButtonComponentWithCustomId, ButtonInteraction } from 'discord.js';

const denyModApplicationModal = denyModApplicationModalHandler.modal;

const denyButton = new ButtonBuilder();
denyButton.setCustomId('mod-application-deny');
denyButton.setLabel('Deny');
denyButton.setStyle(ButtonStyle.Danger);

async function modApplicationDenyHandler(interaction: ButtonInteraction): Promise<void> {
	await interaction.showModal(denyModApplicationModal);
}

const handler: ButtonHandler = {
	name: (denyButton.data as APIButtonComponentWithCustomId).custom_id,
	button: denyButton,
	handler: modApplicationDenyHandler
};

export default handler;
