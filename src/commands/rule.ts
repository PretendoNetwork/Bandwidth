import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, MessageFlags, PermissionFlagsBits, StringSelectMenuBuilder } from 'discord.js';
import { getAllRules } from '@/database';
import updateRuleModalHandler from '@/modals/update-rule';
import type { CommandHandler } from '@/types/general-types';
import type { ChatInputCommandInteraction } from 'discord.js';

const updateRuleModal = updateRuleModalHandler.modal;

async function rulesHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	const { guildId } = interaction;
	// const ruleNumber = interaction.options.getInteger('rule-number');

	if (interaction.options.getSubcommand() === 'create') {
		await interaction.showModal(updateRuleModal);
		return;
	}

	if (['update', 'preview', 'remove'].includes(interaction.options.getSubcommand())) {
		const rules = await getAllRules(guildId!);

		if (rules.length === 0) {
			await interaction.reply({
				content: 'There are no rules set. Use /rule create to make some.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		const ruleSelectMenu = new StringSelectMenuBuilder();
		ruleSelectMenu.setCustomId(`${interaction.options.getSubcommand()}-rule-selection`);
		ruleSelectMenu.setPlaceholder('Select a rule...');

		for (let i = 0; i < rules.length; i++) {
			ruleSelectMenu.addOptions({
				label: `#${i + 1}: ${rules[i].title}`,
				value: rules[i].id.toString()
			});
		}

		const row = new ActionRowBuilder<StringSelectMenuBuilder>();
		row.addComponents(ruleSelectMenu);

		await interaction.reply({
			content: `Select a rule to ${interaction.options.getSubcommand()}...`,
			components: [row],
			flags: MessageFlags.Ephemeral
		});

		return;
	}

	throw new Error('unhandled subcommand');
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
command.setName('rule');
command.setDescription('Change options relating to rules');
command.addSubcommand((cmd) => {
	cmd.setName('create');
	cmd.setDescription('Create a rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('update');
	cmd.setDescription('Update an existing rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('preview');
	cmd.setDescription('View an existing rule');
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('remove');
	cmd.setDescription('Remove a rule');
	return cmd;
});

const handler: CommandHandler = {
	name: command.name,
	help: 'Change rules of the bot',
	handler: rulesHandler,
	deploy: command.toJSON()
};

export default handler;
