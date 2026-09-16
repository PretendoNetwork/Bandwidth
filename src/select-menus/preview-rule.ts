import { StringSelectMenuBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getRule } from '@/database';
import type { SelectMenuHandler } from '@/types/general-types';
import type { StringSelectMenuInteraction } from 'discord.js';

const previewRuleMenu = new StringSelectMenuBuilder();
previewRuleMenu.setCustomId('preview-rule-selection');
previewRuleMenu.setMaxValues(5);
previewRuleMenu.setPlaceholder('Select a rule to preview');

async function previewRuleHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	const guildId = interaction.guildId!;
	const ruleId = interaction.values[0];

	const rule = await getRule(guildId, ruleId);

	if (!rule) {
		throw new Error(`Rule with ID ${ruleId} not found`);
	}

	const ruleEmbed = new EmbedBuilder();
	ruleEmbed.setColor(0x9D6FF3);
	ruleEmbed.setTitle(`Rule: ${rule.title}`);
	ruleEmbed.setFooter({
		text: `Here's a preview of what your rule looks like. Users are waiting ${rule.time} seconds.`
	});

	ruleEmbed.setDescription(rule.description);

	await interaction.reply({
		embeds: [ruleEmbed],
		flags: MessageFlags.Ephemeral
	});
}

const handler: SelectMenuHandler = {
	name: previewRuleMenu.data.custom_id!,
	select_menu: previewRuleMenu,
	handler: previewRuleHandler
};

export default handler;
