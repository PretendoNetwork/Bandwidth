import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { checkAutomaticHelpDisabled, enabledAutomaticHelp, disableAutomaticHelp } from '@/database';
import type { CommandHandler } from '@/types/general-types';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

async function toggleAutomaticHelpHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral
	});

	const guildId = interaction.guildId!;
	const memberId = (interaction.member as GuildMember).id;

	const isHelpDisabled = await checkAutomaticHelpDisabled(guildId, memberId);

	if (isHelpDisabled) {
		await enabledAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**enabled**_ for your account.\nTo disable automatic help, use the `/toggle-automatic-help` command'
		});
	} else {
		await disableAutomaticHelp(guildId, memberId);
		await interaction.editReply({
			content: 'Automatic help has been _**disabled**_ for your account.\nTo enable automatic help, use the `/toggle-automatic-help` command'
		});
	}
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
command.setName('toggle-automatic-help');
command.setDescription('Toggle on/off Bandwidth\'s automatic help');

const handler: CommandHandler = {
	name: command.name,
	help: 'Toggle on/off Bandwidth\'s automatic help.\n```\nUsage: /toggle-automatic-help\n```',
	handler: toggleAutomaticHelpHandler,
	deploy: command.toJSON()
};

export default handler;
