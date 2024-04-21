const Discord = require('discord.js');

const titleTextInput = new Discord.TextInputBuilder();
titleTextInput.setCustomId('title');
titleTextInput.setLabel('Title');
titleTextInput.setStyle(Discord.TextInputStyle.Short);
titleTextInput.setPlaceholder('Title of the rule');
titleTextInput.setRequired(true);
titleTextInput.setMaxLength(50);

const descriptionTextInput = new Discord.TextInputBuilder();
descriptionTextInput.setCustomId('description');
descriptionTextInput.setStyle(Discord.TextInputStyle.Paragraph);
descriptionTextInput.setLabel('Rule Description');
descriptionTextInput.setPlaceholder('Description of the rule');
descriptionTextInput.setRequired(true);

const timeTextInput = new Discord.TextInputBuilder();
timeTextInput.setCustomId('time');
timeTextInput.setLabel('Rule time');
timeTextInput.setStyle(Discord.TextInputStyle.Short);
timeTextInput.setPlaceholder('Time in seconds the user has to wait to continue');
timeTextInput.setRequired(true);
timeTextInput.setMaxLength(2);

const actionRow1 = new Discord.ActionRowBuilder();
actionRow1.addComponents(titleTextInput);

const actionRow2 = new Discord.ActionRowBuilder();
actionRow2.addComponents(descriptionTextInput);

const actionRow3 = new Discord.ActionRowBuilder();
actionRow3.addComponents(timeTextInput);

const updateRuleModal = new Discord.ModalBuilder();
updateRuleModal.setCustomId('update-rule');
updateRuleModal.setTitle('Create Rule');
updateRuleModal.addComponents(actionRow1, actionRow2, actionRow3);

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function updateRuleHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const id = interaction.customId.split('-')[2] || 0;

	const title = interaction.fields.getTextInputValue('title').trim();
	const description = interaction.fields.getTextInputValue('description').trim();
	const time = Number(interaction.fields.getTextInputValue('time').trim());

	if (time < 0 || isNaN(time)) {
		await interaction.editReply({
			content: 'Oops! That isn\'t a valid time number.',
			ephemeral: true
		});
		return;
	}

	const ruleEmbed = new Discord.EmbedBuilder();
	ruleEmbed.setColor(0x9D6FF3);
	ruleEmbed.setTitle(`Rule: ${title}`);
	ruleEmbed.setFooter({
		text: `Here's a preview of what your rule will look like. Users will wait ${time} seconds.`
	});
	ruleEmbed.setDescription(description);

	const actionRow = new Discord.ActionRowBuilder();

	const confirmRuleUpdateButton = new Discord.ButtonBuilder();
	confirmRuleUpdateButton.setCustomId(`confirm-rule-update-${id}-${title}-${time}`);
	confirmRuleUpdateButton.setLabel(`${id === 0 ? 'Create' : 'Update'} Rule`);
	confirmRuleUpdateButton.setStyle(Discord.ButtonStyle.Success);

	actionRow.addComponents(confirmRuleUpdateButton);

	await interaction.editReply({
		embeds: [ruleEmbed],
		components: [actionRow],
		ephemeral: true
	});
}

module.exports = {
	name: updateRuleModal.data.custom_id,
	modal: updateRuleModal,
	handler: updateRuleHandler
};