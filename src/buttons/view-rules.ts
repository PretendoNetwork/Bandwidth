import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getAllRules } from '@/database';
import verifyCompleteButtonHandler from '@/buttons/verify-complete';
import type { ButtonHandler } from '@/types/general-types';
import type { APIButtonComponentWithCustomId, ButtonInteraction } from 'discord.js';

const verifyCompleteButton = verifyCompleteButtonHandler.button;
const viewRulesButton = new ButtonBuilder();
viewRulesButton.setCustomId('view-rules');
viewRulesButton.setLabel('View Rules');
viewRulesButton.setStyle(ButtonStyle.Primary);

async function viewRulesHandler(interaction: ButtonInteraction): Promise<void> {
	const parts = interaction.customId.split('-');
	const ruleId = Number(parts[2]) || 0;

	const rules = await getAllRules(interaction.guildId!);
	const rule = rules[ruleId];

	const nextButton = new ButtonBuilder();
	nextButton.setCustomId(`view-rules-${ruleId + 1}`);
	nextButton.setLabel('Next');
	nextButton.setStyle(ButtonStyle.Primary);
	nextButton.setEmoji('⏩');
	nextButton.setDisabled(false);

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents(nextButton);

	if (rules.length === 0) {
		row.setComponents(verifyCompleteButton);
		await interaction.reply({
			content: 'No rules are set, press Verify to continue.',
			components: [row],
			flags: MessageFlags.Ephemeral
		});
		return;
	}

	const ruleEmbed = new EmbedBuilder();
	ruleEmbed.setColor(0x9D6FF3);
	ruleEmbed.setTitle(`Rule ${ruleId + 1}: ${rule.title}`);
	ruleEmbed.setDescription(rule.description);

	if (ruleId === 0) {
		await interaction.reply({
			embeds: [ruleEmbed],
			components: [row],
			flags: MessageFlags.Ephemeral
		});
	} else {
		await interaction.update({
			embeds: [ruleEmbed],
			components: [row]
		});
	}

	let time = Number(rule.time);
	if (time !== 0) {
		async function countdown(): Promise<void> {
			nextButton.setLabel(time === 0 ? 'Next' : `Next (${time})`);
			nextButton.setDisabled(time !== 0);
			time -= 1;

			row.setComponents(nextButton);

			if (time === -1) {
				clearInterval(timer);
				if (rules[ruleId + 1] === undefined) {
					row.setComponents(verifyCompleteButton);
					await interaction.editReply({ components: [row] });
				}
			}

			await interaction.editReply({ components: [row] });
		}

		// * call once immediately then once every second
		await countdown();
		const timer = setInterval(countdown, 1000);
	} else {
		if (rules[ruleId + 1] === undefined) {
			row.setComponents(verifyCompleteButton);
			await interaction.editReply({ components: [row] });
		}
	}
}

const handler: ButtonHandler = {
	name: (viewRulesButton.data as APIButtonComponentWithCustomId).custom_id,
	button: viewRulesButton,
	handler: viewRulesHandler
};

export default handler;
