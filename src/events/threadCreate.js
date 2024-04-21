const timers = require('node:timers/promises');
const Discord = require('discord.js');
const { button: expandErrorButton } = require('../buttons/expand-error');
const errorCodeUtils = require('../utils/errorCode');
const database = require('../database');

/**
 *
 * @param {Discord.ThreadChannel} threadChannel
 */
async function threadCreateHandler(threadChannel) {
	if (
		threadChannel.type !== Discord.ChannelType.GuildPublicThread ||
		threadChannel.parent.type !== Discord.ChannelType.GuildForum
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
	const isHelpDisabled = await database.checkAutomaticHelpDisabled(threadChannel.guildId, threadChannel.ownerId);

	if (isHelpDisabled) {
		// * Bail if automatic help is disabled
		return;
	}

	await tryAutomaticHelp(threadChannel);
}

/**
 *
 * @param {Discord.ThreadChannel} threadChannel
 */
async function tryAutomaticHelp(threadChannel) {
	const errorCodeEmbed = errorCodeUtils.checkForErrorCode(threadChannel.name);
	const row = new Discord.ActionRowBuilder();

	if (errorCodeEmbed) {
		await threadChannel.messages.fetch();

		row.addComponents(expandErrorButton);

		const embed = new Discord.EmbedBuilder();
		embed.setColor(errorCodeEmbed.data.color);
		embed.setTitle(errorCodeEmbed.data.title);
		embed.setDescription('Support code detected, press to expand information');

		await threadChannel.send({
			embeds: [embed],
			components: [row]
		});
	}
}

module.exports = threadCreateHandler;
