import { MessageFlags, StringSelectMenuBuilder } from 'discord.js';
import { removeRule } from '@/database';
import type { SelectMenuHandler } from '@/types/general-types';
import type { StringSelectMenuInteraction } from 'discord.js';

const removeRuleMenu = new StringSelectMenuBuilder();
removeRuleMenu.setCustomId('remove-rule-selection');
removeRuleMenu.setMaxValues(5);
removeRuleMenu.setPlaceholder('Select a rule to remove');

async function removeRuleHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	const guildId = interaction.guildId!;
	const ruleId = interaction.values[0];

	await removeRule(guildId, ruleId);

	await interaction.reply({
		content: 'Rule removed!',
		flags: MessageFlags.Ephemeral
	});
}

const handler: SelectMenuHandler = {
	name: removeRuleMenu.data.custom_id!,
	select_menu: removeRuleMenu,
	handler: removeRuleHandler
};

export default handler;
