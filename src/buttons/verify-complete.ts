import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { ButtonHandler } from '@/types/general-types';
import type { APIButtonComponentWithCustomId, ButtonInteraction, GuildMember } from 'discord.js';

const verifyCompleteButton = new ButtonBuilder();
verifyCompleteButton.setCustomId('verify-complete');
verifyCompleteButton.setLabel('Verify');
verifyCompleteButton.setStyle(ButtonStyle.Success);

async function verifyCompleteHandler(interaction: ButtonInteraction): Promise<void> {
	await interaction.deferUpdate();

	try {
		const role = interaction.guild!.roles.cache.get(await getGuildSetting(interaction.guildId!, 'unverified_role_id'))!;
		await (interaction.member as GuildMember).roles.remove(role);
	} catch {
		// Do nothing, role is already removed
	}
}

const handler: ButtonHandler = {
	name: (verifyCompleteButton.data as APIButtonComponentWithCustomId).custom_id,
	button: verifyCompleteButton,
	handler: verifyCompleteHandler
};

export default handler;
