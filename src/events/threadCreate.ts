import timers from 'node:timers/promises';
import { ChannelType, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import { checkAutomaticHelpDisabled } from '@/database';
import expandErrorButtonHandler from '@/buttons/expand-error';
import { checkForErrorCode } from '@/utils/errorCode';
import type { ButtonBuilder, ThreadChannel } from 'discord.js';

const expandErrorButton = expandErrorButtonHandler.button;

export default async function threadCreateHandler(threadChannel: ThreadChannel): Promise<void> {
	if (
		threadChannel.type !== ChannelType.PublicThread ||
		threadChannel.parent?.type !== ChannelType.GuildForum
	) {
		return;
	}

	// * Wait 0.5 seconds and check if
	// * the bot has already responded
	await timers.setTimeout(500);

	await threadChannel.messages.fetch();

	if (threadChannel.lastMessage?.author.bot) {
		// * Bot already responded
		return;
	}

	// * Check if automatic help is disabled
	const isHelpDisabled = await checkAutomaticHelpDisabled(threadChannel.guildId, threadChannel.ownerId);

	if (isHelpDisabled) {
		// * Bail if automatic help is disabled
		return;
	}

	await tryAutomaticHelp(threadChannel);
}

async function tryAutomaticHelp(threadChannel: ThreadChannel): Promise<void> {
	const errorCodeEmbed = checkForErrorCode(threadChannel.name);
	const row = new ActionRowBuilder<ButtonBuilder>();

	if (errorCodeEmbed) {
		await threadChannel.messages.fetch();

		row.addComponents(expandErrorButton);

		const embed = new EmbedBuilder();
		embed.setColor(errorCodeEmbed.data.color!);
		embed.setTitle(errorCodeEmbed.data.title!);
		embed.setDescription('Support code detected, press to expand information');

		await threadChannel.send({
			embeds: [embed],
			components: [row]
		});
	}
}
