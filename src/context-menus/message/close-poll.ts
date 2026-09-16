import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType, MessageFlags, PermissionFlagsBits } from 'discord.js';
import { closePoll } from '@/utils/polls';
import type { ContextMenuCommandInteraction } from 'discord.js';
import type { ContextMenuHandler } from '@/types/general-types';

async function closePollHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const { targetId } = interaction;

	const message = await interaction.channel!.messages.fetch(targetId);

	await closePoll(message);

	await interaction.reply({
		content: 'Poll closed!',
		flags: MessageFlags.Ephemeral
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
contextMenu.setName('Close Poll');
contextMenu.setType(ApplicationCommandType.Message);

const handler: ContextMenuHandler = {
	name: contextMenu.name,
	handler: closePollHandler,
	deploy: contextMenu.toJSON()
};

export default handler;
