const Discord = require('discord.js');
const { button: disableNLPButton } = require('../buttons/disable-nlp');
const wiiuSupportCodes = require('../console-errors/wiiu/support-codes');
const threeDSSupportCodes = require('../console-errors/3ds/support-codes');
const pretendoSupportCodes = require('../console-errors/pretendo/support-codes');
const database = require('../database');

const ayyRegex = /\bay{1,}\b/gi;
const owoRegex = /\bowo{1,}\b/gi;
const WIIU_SUPPORT_CODE_REGEX = /(1\d{2}-\d{4})/gm;
const THREE_DS_SUPPORT_CODE_REGEX = /(0\d{2}-\d{4})/gm;
// * There is probably a better way to do this regex
const PRETENDO_SUPPORT_CODE_REGEX = /(678-\d{4}|598-\d{4})/gm; // * 678 = Martini, 598 = Juxtaposition

/**
 *
 * @param {Discord.Message} message
 */
async function messageCreateHandler(message) {
	if (message.author.bot) return;

	// Check if the message is a command and handle it
	if (message.content === '.toggleupdates') {
		await message.reply('Looks like you tried to use a legacy command! Try our new slash commands by just typing '/'!');
		return;
	}

	// ayy => lmaoo
	if (ayyRegex.test(message.content)) {
		const lmaod = message.content.replaceAll(ayyRegex, (match) => {
			let newMatch = match.replaceAll('y', 'o').replaceAll('Y', 'O');
			newMatch = newMatch.replaceAll('a', 'lma').replaceAll('A', 'LMA');
			return newMatch;
		});

		// Check that the message isn't too long to be sent
		if (lmaod.length < 2000) {
			await message.reply({
				content: lmaod,
				allowedMentions: { parse: [] }
			});
		} else {
			await message.reply('Looks like the resulting message is too long :/');
		}

		return;
	}

	if (owoRegex.test(message.content)) {
		// Assigning the only role worthy of this horrible command
		if (message.member.roles.cache.find(role => role.name === 'Developer')) {
			const uwud = message.content.replaceAll(message.content, (match) => {
				let newMatch = match.replaceAll('o', 'u').replaceAll('O', 'U');
				newMatch = newMatch.replaceAll('w', 'w').replaceAll('W', 'W');
				newMatch = newMatch.replaceAll('r', 'w').replaceAll('R', 'W');
				newMatch = newMatch.replaceAll('l', 'w').replaceAll('L', 'W');
				newMatch = newMatch.replaceAll('?', '? :pleading_face:');
				return newMatch;
			});

			// See if a threat should be made
			if (uwud.length < 2000) {
				await message.reply({
					content: uwud,
					allowedMentions: { parse: [] }
				});
			} else {
				await message.reply('192.' + randomNumberGen(255) + '.' + randomNumberGen(255) + '.' + randomNumberGen(255) + ' start running sweetie :nail_care:');
			}

			return;
		}
	}


	// * Check if automatic help is disabled
	const isHelpDisabled = await database.checkAutomaticHelpDisabled(message.guildId, message.member.id);

	if (isHelpDisabled) {
		// * Bail if automatic help is disabled
		return;
	}

	await tryAutomaticHelp(message);
}

// For the funny ip thing
function randomNumberGen (max) {
	var randomNumber = Math.floor(Math.random() * max);
	return randomNumber;
}

/**
 *
 * @param {Discord.Message} message
 */
async function tryAutomaticHelp(message) {
	const errorCodeEmbed = checkForErrorCode(message);

	if (errorCodeEmbed) {
		const errorChannelId = await database.getGuildSetting(message.guildId, 'error_channel_id');
		const unsupportedChannelEmbed = unsupportedErrorChannel(errorChannelId);

		// Check if any channel has been whitelisted at all
		const channels = await message.guild.channels.fetch();
		const errorChannel = channels.find(channel => channel.id === errorChannelId);

		if (!errorChannel) {
			throw new Error('Error support failed to submit - no channel whitelisted');
		}

		if (message.channelId === errorChannelId) {
			// * Found an error/support code
			// * Send it and bail
			await message.reply({
				embeds: [errorCodeEmbed]
			});
	
			return;
		} else {
			await message.reply({
				embeds: [unsupportedChannelEmbed]});
		}
	}


	// * NLP
	const response = await message.guild.client.nlpManager.process(message.content);

	if (response.intent === 'None' || response.score <= 0.7) {
		// * Do nothing if no intent found or if the bot is not very sure
		return;
	}

	let content = response.answer;

	content += '\n\n_This message was detected as needing help using machine learning, and responded to automatically. Was this done in error?\nIf you would like to stop receiving automatic help, use the `Disable Automatic Help` button below, or use the `/toggle-automatic-help` command_';

	const row = new Discord.ActionRowBuilder();
	row.addComponents(disableNLPButton);

	const messagePayload = {
		content: content,
		components: [row]
	};

	await message.reply(messagePayload);
}

/**
 *
 * @param {Discord.Message} message
 */
function checkForErrorCode(message) {
	// TODO - WiiU error codes, 3DS error codes

	// * Run this check first to avoid WiiU conflicts
	if (PRETENDO_SUPPORT_CODE_REGEX.test(message.content)) {
		return getPretendoSupportCodeInfo(message.content.match(PRETENDO_SUPPORT_CODE_REGEX)[0]);
	}

	if (WIIU_SUPPORT_CODE_REGEX.test(message.content)) {
		return getWiiUSupportCodeInfo(message.content.match(WIIU_SUPPORT_CODE_REGEX)[0]);
	}

	if (THREE_DS_SUPPORT_CODE_REGEX.test(message.content)) {
		return get3DSSupportCodeInfo(message.content.match(THREE_DS_SUPPORT_CODE_REGEX)[0]);
	}
}

function unsupportedErrorChannel(whitelistedErrorChannel) {
	const embed = new Discord.EmbedBuilder();
	embed.setColor(0x000000);
	embed.setTitle('Blacklisted Channel');
	embed.setDescription(`This channel doesn't allow for error support.\nPlease refer to <#${whitelistedErrorChannel}>`);

	return embed;
}

function getWiiUSupportCodeInfo(supportCode) {
	const [moduleId, descriptionId] = supportCode.split('-');

	const mod = wiiuSupportCodes[moduleId]; // * `module` is reserved

	if (!mod || !mod.codes[descriptionId]) {
		return;
	}

	const code = mod.codes[descriptionId];

	const embed = new Discord.EmbedBuilder();
	embed.setColor(0x009AC7);
	embed.setTitle(`${supportCode} (Wii U)`);
	embed.setDescription('Wii U support code detected\nInformation is WIP and may be missing/incorrect');
	embed.setFields([
		{
			name: 'Module Name',
			value: mod.name,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Module Description',
			value: mod.description,
			inline: true
		},
		{
			name: 'Error Name',
			value: `\`${code.name}\``,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Error Description',
			value: code.description,
			inline: true
		},
		{
			name: 'Fix',
			value: code.fix
		},
		{
			name: 'Console dialog message',
			value: `\`\`\`\n${code.message}\n\`\`\``
		}
	]);

	if (code.link !== 'Missing link') {
		embed.setURL(code.link);
	}
	return embed;
}

function get3DSSupportCodeInfo(supportCode) {
	const [moduleId, descriptionId] = supportCode.split('-');

	const mod = threeDSSupportCodes[moduleId]; // * `module` is reserved

	if (!mod || !mod.codes[descriptionId]) {
		return;
	}

	const code = mod.codes[descriptionId];

	const embed = new Discord.EmbedBuilder();
	embed.setColor(0xD12228);
	embed.setTitle(`${supportCode} (3DS/2DS)`);
	embed.setDescription('3DS/2DS support code detected\nInformation is WIP and may be missing/incorrect');
	embed.setFields([
		{
			name: 'Module Name',
			value: mod.name,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Module Description',
			value: mod.description,
			inline: true
		},
		{
			name: 'Error Name',
			value: `\`${code.name}\``,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Error Description',
			value: code.description,
			inline: true
		},
		{
			name: 'Fix',
			value: code.fix
		},
		{
			name: 'Console dialog message',
			value: `\`\`\`\n${code.message}\n\`\`\``
		}
	]);

	if (code.link !== 'Missing link') {
		embed.setURL(code.link);
	}

	return embed;
}

function getPretendoSupportCodeInfo(supportCode) {
	const [moduleId, descriptionId] = supportCode.split('-');

	const mod = pretendoSupportCodes[moduleId]; // * `module` is reserved

	if (!mod) {
		return;
	}

	let codeId = descriptionId;

	if (moduleId.startsWith('598')) {
		// TODO - Add in all these codes instead of this hacky bs

		if (codeId.startsWith('1')) {
			codeId = '1XXX';
		}

		if (codeId.startsWith('2')) {
			codeId = '2XXX';
		}

		if (codeId.startsWith('3')) {
			codeId = '3XXX';
		}

		if (codeId.startsWith('4')) {
			codeId = '4XXX';
		}

		if (codeId.startsWith('5')) {
			codeId = '5XXX';
		}
	}

	if (!mod.codes[codeId]) {
		return;
	}

	const code = mod.codes[codeId];

	const embed = new Discord.EmbedBuilder();
	embed.setColor(0x131733);
	embed.setTitle(`${supportCode} (Pretendo)`);
	embed.setFields([
		{
			name: 'Module Name',
			value: mod.name,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Module Description',
			value: mod.description,
			inline: true
		},
		{
			name: 'Error Name',
			value: `\`${code.name}\``,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: true
		},
		{
			name: 'Error Description',
			value: code.description,
			inline: true
		}
	]);

	if (code.fix !== 'N/A') {
		embed.addFields({
			name: 'Fix',
			value: code.fix
		});
	}

	if (code.link !== 'Missing link') {
		embed.setURL(code.link);
	}

	return embed;
}

module.exports = messageCreateHandler;
