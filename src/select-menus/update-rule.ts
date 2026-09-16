import { ActionRowBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getRule } from '@/database';
import type { SelectMenuHandler } from '@/types/general-types';
import type { StringSelectMenuInteraction } from 'discord.js';

const ruleUpdateMenu = new StringSelectMenuBuilder();
ruleUpdateMenu.setCustomId('update-rule-selection');
ruleUpdateMenu.setMaxValues(5);
ruleUpdateMenu.setPlaceholder('Select a rule to update');

async function ruleUpdateHandler(interaction: StringSelectMenuInteraction): Promise<void> {
	const guildId = interaction.guildId!;
	const ruleId = interaction.values[0];
	let title: string | undefined;
	let description: string | undefined;
	let time: string | undefined;

	const oldRule = await getRule(guildId, ruleId);

	if (oldRule !== undefined) {
		title = oldRule.title;
		description = oldRule.description;
		time = oldRule.time.toString();
	}

	const titleTextInput = new TextInputBuilder();
	titleTextInput.setCustomId('title');
	titleTextInput.setLabel('Title');
	titleTextInput.setStyle(TextInputStyle.Short);
	titleTextInput.setPlaceholder('Title of the rule');
	titleTextInput.setValue(title || '');
	titleTextInput.setRequired(true);
	titleTextInput.setMaxLength(50);

	const descriptionTextInput = new TextInputBuilder();
	descriptionTextInput.setCustomId('description');
	descriptionTextInput.setStyle(TextInputStyle.Paragraph);
	descriptionTextInput.setLabel('Rule Description');
	descriptionTextInput.setPlaceholder('Description of the rule');
	descriptionTextInput.setValue(description || '');
	descriptionTextInput.setRequired(true);

	const timeTextInput = new TextInputBuilder();
	timeTextInput.setCustomId('time');
	timeTextInput.setLabel('Rule time');
	timeTextInput.setStyle(TextInputStyle.Short);
	timeTextInput.setPlaceholder('Time in seconds the user has to wait to continue');
	timeTextInput.setValue(time || '');
	timeTextInput.setRequired(true);
	timeTextInput.setMaxLength(2);

	const actionRow1 = new ActionRowBuilder<TextInputBuilder>();
	actionRow1.addComponents(titleTextInput);

	const actionRow2 = new ActionRowBuilder<TextInputBuilder>();
	actionRow2.addComponents(descriptionTextInput);

	const actionRow3 = new ActionRowBuilder<TextInputBuilder>();
	actionRow3.addComponents(timeTextInput);

	const updateRuleModal = new ModalBuilder();
	updateRuleModal.setCustomId(`update-rule-${ruleId}`);
	updateRuleModal.setTitle('Update Rule');
	updateRuleModal.addComponents(actionRow1, actionRow2, actionRow3);

	await interaction.showModal(updateRuleModal);
}

const handler: SelectMenuHandler = {
	name: ruleUpdateMenu.data.custom_id!,
	select_menu: ruleUpdateMenu,
	handler: ruleUpdateHandler
};

export default handler;
