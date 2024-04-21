const Discord = require('discord.js');
const database = require('../database');

const ruleUpdateMenu = new Discord.StringSelectMenuBuilder();
ruleUpdateMenu.setCustomId('update-rule-selection');
ruleUpdateMenu.setMaxValues(5);
ruleUpdateMenu.setPlaceholder('Select a rule to update');

/**
 *
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function ruleUpdateHandler(interaction) {
	const { guildId } = interaction;
	const ruleId = interaction.values[0];
	let title;
	let description;
	let time;

	const oldRule = await database.getRule(guildId, ruleId);

	if (oldRule !== undefined) {
		title = oldRule.title;
		description = oldRule.description;
		time = oldRule.time.toString();
	}

	const titleTextInput = new Discord.TextInputBuilder();
	titleTextInput.setCustomId('title');
	titleTextInput.setLabel('Title');
	titleTextInput.setStyle(Discord.TextInputStyle.Short);
	titleTextInput.setPlaceholder('Title of the rule');
	titleTextInput.setValue(title || '');
	titleTextInput.setRequired(true);
	titleTextInput.setMaxLength(50);

	const descriptionTextInput = new Discord.TextInputBuilder();
	descriptionTextInput.setCustomId('description');
	descriptionTextInput.setStyle(Discord.TextInputStyle.Paragraph);
	descriptionTextInput.setLabel('Rule Description');
	descriptionTextInput.setPlaceholder('Description of the rule');
	descriptionTextInput.setValue(description || '');
	descriptionTextInput.setRequired(true);

	const timeTextInput = new Discord.TextInputBuilder();
	timeTextInput.setCustomId('time');
	timeTextInput.setLabel('Rule time');
	timeTextInput.setStyle(Discord.TextInputStyle.Short);
	timeTextInput.setPlaceholder('Time in seconds the user has to wait to continue');
	timeTextInput.setValue(time || '');
	timeTextInput.setRequired(true);
	timeTextInput.setMaxLength(2);

	const actionRow1 = new Discord.ActionRowBuilder();
	actionRow1.addComponents(titleTextInput);

	const actionRow2 = new Discord.ActionRowBuilder();
	actionRow2.addComponents(descriptionTextInput);

	const actionRow3 = new Discord.ActionRowBuilder();
	actionRow3.addComponents(timeTextInput);

	const updateRuleModal = new Discord.ModalBuilder();
	updateRuleModal.setCustomId(`update-rule-${ruleId}`);
	updateRuleModal.setTitle('Update Rule');
	updateRuleModal.addComponents(actionRow1, actionRow2, actionRow3);

	await interaction.showModal(updateRuleModal, {
		client: interaction.client,
		interaction: interaction
	});
}

module.exports = {
	name: ruleUpdateMenu.data.custom_id,
	select_menu: ruleUpdateMenu,
	handler: ruleUpdateHandler
};