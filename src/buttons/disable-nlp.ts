import { ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { checkAutomaticHelpDisabled, disableAutomaticHelp } from '@/database';
import type { ButtonHandler } from '@/types/general-types';
import type { APIButtonComponentWithCustomId, ButtonInteraction, GuildMember } from 'discord.js';

const disableNLPButton = new ButtonBuilder();
disableNLPButton.setCustomId('disable-nlp');
disableNLPButton.setLabel('Disable Automatic Help');
disableNLPButton.setStyle(ButtonStyle.Danger);

async function disableNLPHandler(interaction: ButtonInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const guildId = interaction.guildId!;
	const memberId = (interaction.member as GuildMember).id;

	const isHelpDisabled = await checkAutomaticHelpDisabled(guildId, memberId);

	if (isHelpDisabled) {
		await interaction.editReply({
			content: 'Automatic help is already disabled for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command'
		});
	} else {
		await disableAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**disabled**_ for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command'
		});
	}
}

const handler: ButtonHandler = {
	name: (disableNLPButton.data as APIButtonComponentWithCustomId).custom_id,
	button: disableNLPButton,
	handler: disableNLPHandler
};

export default handler;
