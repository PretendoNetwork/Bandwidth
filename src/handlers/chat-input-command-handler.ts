import { MessageFlags } from 'discord.js';
import { isInteractionOnCooldown, beginCooldown } from '@/utils/cooldown';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export default async function chatInputCommandHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	const { commandName } = interaction;

	const commands = interaction.client.commands;
	const command = commands.get(commandName);
	const memberId = (interaction.member as GuildMember).id;

	// do nothing if no command
	if (!command) {
		throw new Error(`Missing command handler for \`${commandName}\``);
	}

	// check for cooldown and run the command
	const cooldown = await isInteractionOnCooldown(command, memberId);
	if (!cooldown) {
		await command.handler(interaction);
		await beginCooldown(command, memberId);
	} else {
		await interaction.reply(
			{
				embeds: [cooldown],
				flags: MessageFlags.Ephemeral
			}
		);
	}
}
