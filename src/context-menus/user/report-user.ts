import { PermissionFlagsBits } from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import reportUserModalHandler from '@/modals/report-user';
import type { ContextMenuHandler } from '@/types/general-types';
import type { ContextMenuCommandInteraction } from 'discord.js';

const reportUserModal = reportUserModalHandler.modal;

async function reportUserHandler(interaction: ContextMenuCommandInteraction): Promise<void> {
	const { targetId } = interaction;

	if (targetId === interaction.user.id) {
		await interaction.reply({
			content: 'Cannot report yourself',
			flags: MessageFlags.Ephemeral
		});
		return;
	}

	const targetMember = await interaction.guild!.members.fetch(targetId);

	if (targetMember.user.bot) {
		await interaction.reply({
			content: 'Cannot report bots as users',
			flags: MessageFlags.Ephemeral
		});
		return;
	}

	reportUserModal.setCustomId(`${reportUserModal.data.custom_id}-${targetId}`);
	reportUserModal.setTitle(`Reporting ${targetMember.user.tag}`);

	await interaction.showModal(reportUserModal);
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
contextMenu.setName('Report User');
contextMenu.setType(ApplicationCommandType.User);

const handler: ContextMenuHandler = {
	name: contextMenu.name,
	help: 'Report a user. Report will include your provided reason as well as a transcript of a set number of messages in the channel the report was made from.\n```\nUsage: Right click a user and navigate to \'Apps > Report User\'\n```',
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};

export default handler;
