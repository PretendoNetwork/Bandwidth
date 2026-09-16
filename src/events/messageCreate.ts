import { ActionRowBuilder, DMChannel, EmbedBuilder } from 'discord.js';
import disableNLPButtonHandler from '@/buttons/disable-nlp';
import expandErrorButtonHandler from '@/buttons/expand-error';
import { checkForErrorCode } from '@/utils/errorCode';
import { checkNetworkDumpsUploaded } from '@/utils/check-network-dumps-uploaded';
import { checkAutomaticHelpDisabled, checkAyLmaoDisabled } from '@/database';
import type { ButtonBuilder, Message } from 'discord.js';

const disableNLPButton = disableNLPButtonHandler.button;
const expandErrorButton = expandErrorButtonHandler.button;

const ayyRegex = /\bay{1,}\b/gi;

export default async function messageCreateHandler(message: Message): Promise<void> {
	if (message.author.bot) {
		return;
	}

	// * Message was sent in the guild
	if (!(message.channel instanceof DMChannel)) {
		const guildId = message.guildId!;
		const isAyLmaoDisabled = await checkAyLmaoDisabled(guildId);

		if (!isAyLmaoDisabled && ayyRegex.test(message.content)) {
			// * ayy => lmaoo
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
		const isHelpDisabled = await checkAutomaticHelpDisabled(guildId, message.member!.id);

		if (!isHelpDisabled) {
			// * Only do automatic help if not disabled
			await tryAutomaticHelp(message);
		}

		await checkNetworkDumpsUploaded(message);
	} else {
		await message.reply('Hello! These DMs are __not__ monitored.\n\nIf you wish to contact Pretendo\'s mod team, please read the contents of https://discord.com/channels/408718485913468928/1370584407261581392, then create a modmail ticket for your issue.\n\nIf you want to submit a Network appeal/report or Discord ban appeal, please do so on the **[Forum](<https://forum.pretendo.network/>)**.\n\nTo view your warns, run Chubby\'s `/user-info` command.');
	}
}

async function tryAutomaticHelp(message: Message): Promise<void> {
	const errorCodeEmbed = checkForErrorCode(message.content);
	const row = new ActionRowBuilder<ButtonBuilder>();

	if (errorCodeEmbed) {
		// * Found an error/support code
		// * Send it and bail

		row.addComponents(expandErrorButton);

		const embed = new EmbedBuilder();
		embed.setColor(errorCodeEmbed.data.color!);
		embed.setTitle(errorCodeEmbed.data.title!);
		embed.setDescription('Support code detected, press to expand information');

		await message.reply({
			embeds: [embed],
			components: [row]
		});

		return;
	}

	// * NLP
	const response = await message.guild!.client.aiMessageProcessor.getResponseOrNothing(message.content);

	if (!response) {
		// * Do nothing if no response was found
		// * This means either no intent was found or the NLP was not very sure
		// * "Very sure" is determined by message.guild.client.aiMessageProcessor.classifierThreshold
		return;
	}

	const content = response + '\n\n_This message was detected as needing help using machine learning, and responded to automatically. Was this done in error?\nIf you would like to stop receiving automatic help, use the `Disable Automatic Help` button below, or use the `/toggle-automatic-help` command_';

	row.addComponents(disableNLPButton);

	await message.reply({
		content: content,
		components: [row]
	});
}
