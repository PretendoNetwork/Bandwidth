import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType, AttachmentBuilder, MessageFlags, PermissionFlagsBits } from 'discord.js';
import type { ContextMenuHandler } from '@/types/general-types';
import type { ContextMenuCommandInteraction } from 'discord.js';

async function reportUserHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const { targetId } = interaction;

	const message = await interaction.channel!.messages.fetch(targetId);
	const messageJSON = message.toJSON() as Record<string, unknown>;

	// Only take the properties we need
	const messagePayload = JSON.stringify({
		content: messageJSON.content || null,
		embeds: messageJSON.embeds || [],
		attachments: messageJSON.attachments || [],
		components: messageJSON.components || []
	});

	await interaction.reply({
		content: 'Message Payload Attached',
		files: [
			new AttachmentBuilder(Buffer.from(messagePayload), {
				name: 'message-payload.json'
			})
		],
		flags: MessageFlags.Ephemeral
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
contextMenu.setName('Get Message Payload');
contextMenu.setType(ApplicationCommandType.Message);

const handler: ContextMenuHandler = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};

export default handler;
