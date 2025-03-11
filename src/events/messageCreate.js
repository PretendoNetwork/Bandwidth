const Discord = require('discord.js');
const { button: disableNLPButton } = require('../buttons/disable-nlp');
const { button: expandErrorButton } = require('../buttons/expand-error');
const errorCodeUtils = require('../utils/errorCode');
const { checkNetworkDumpsUploaded } = require('../utils/check-network-dumps-uploaded');
const database = require('../database');
const { checkAyLmaoDisabled } = require('../database');

const ayyRegex = /\bay{1,}\b/gi;

/**
 *
 * @param {Discord.Message} message
 */
async function messageCreateHandler(message) {
	if (message.author.bot) {
		return;
	}

	// * Message was sent in the guild
	if (!(message.channel instanceof Discord.DMChannel)) {
		// * ayy => lmaoo
		const isAyLmaoDisabled = await checkAyLmaoDisabled(message.guildId);

		if (!isAyLmaoDisabled && ayyRegex.test(message.content)) {
			const lmaod = message.content.replaceAll(ayyRegex, (match) => {
				let newMatch = match.replaceAll('y', 'o').replaceAll('Y', 'O');
				newMatch = newMatch.replaceAll('a', 'lma').replaceAll('A', 'LMA');
				return newMatch;
			});

			// * Check that the message isn't too long to be sent
			if (lmaod.length < 2000) {
				const reply = await message.reply({
					content: lmaod,
					allowedMentions: { parse: [] }
				});
				await reply.suppressEmbeds(true);
			} else {
				await message.reply('Looks like the resulting message is too long :/');
			}
		}

		// * Check if automatic help is disabled
		const isHelpDisabled = await database.checkAutomaticHelpDisabled(message.guildId, message.member.id);

		if (!isHelpDisabled) {
			// * Only do automatic help if not disabled
			await tryAutomaticHelp(message);
		}

		await checkNetworkDumpsUploaded(message);
	}
}

/**
 *
 * @param {Discord.Message} message
 */
async function tryAutomaticHelp(message) {
	const errorCodeEmbed = errorCodeUtils.checkForErrorCode(message.content);
	const row = new Discord.ActionRowBuilder();

	if (errorCodeEmbed) {
		// * Found an error/support code
		// * Send it and bail

		row.addComponents(expandErrorButton);

		const embed = new Discord.EmbedBuilder();
		embed.setColor(errorCodeEmbed.data.color);
		embed.setTitle(errorCodeEmbed.data.title);
		embed.setDescription('Support code detected, press to expand information');

		await message.reply({
			embeds: [embed],
			components: [row]
		});

		return;
	}

	// * NLP
	const response = await message.guild.client.aiMessageProcessor.getResponseOrNothing(message.content);

	if (!response) {
		// * Do nothing if no response was found
		// * This means either no intent was found or the NLP was not very sure
		// * "Very sure" is determined by message.guild.client.aiMessageProcessor.classifierThreshold
		return;
	}

	const content = response + '\n\n_This message was detected as needing help using machine learning, and responded to automatically. Was this done in error?\nIf you would like to stop receiving automatic help, use the `Disable Automatic Help` button below, or use the `/toggle-automatic-help` command_';

	row.addComponents(disableNLPButton);

	const messagePayload = {
		content: content,
		components: [row]
	};

	await message.reply(messagePayload);
}

module.exports = messageCreateHandler;
