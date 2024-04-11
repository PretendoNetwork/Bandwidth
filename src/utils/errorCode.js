const Discord = require('discord.js');
const wiiuSupportCodes = require('../console-errors/wiiu/support-codes');
const threeDSSupportCodes = require('../console-errors/3ds/support-codes');
const pretendoSupportCodes = require('../console-errors/pretendo/support-codes');

const WIIU_SUPPORT_CODE_REGEX = /(\b1\d{2}-\d{4}\b)/gm;
const THREE_DS_SUPPORT_CODE_REGEX = /(\b0\d{2}-\d{4}\b)/gm;
// * There is probably a better way to do this regex
const PRETENDO_SUPPORT_CODE_REGEX = /(\b678-\d{4}\b|\b598-\d{4}\b)/gm; // * 678 = Martini, 598 = Juxtaposition

/**
 *
 * @param {String}} message
 */
function checkForErrorCode(text, locale) {
	// Grab Locales
	const localeJSON = require(`../locales/${locale}.json`);
	
	// TODO - WiiU error codes, 3DS error codes

	// * Run this check first to avoid WiiU conflicts
	if (PRETENDO_SUPPORT_CODE_REGEX.test(text)) {
		return getPretendoSupportCodeInfo(text.match(PRETENDO_SUPPORT_CODE_REGEX)[0], localeJSON);
	}

	if (WIIU_SUPPORT_CODE_REGEX.test(text)) {
		return getWiiUSupportCodeInfo(text.match(WIIU_SUPPORT_CODE_REGEX)[0], localeJSON);
	}

	if (THREE_DS_SUPPORT_CODE_REGEX.test(text)) {
		return get3DSSupportCodeInfo(text.match(THREE_DS_SUPPORT_CODE_REGEX)[0], localeJSON);
	}
}

function getWiiUSupportCodeInfo(supportCode, localeJSON) {
	const [moduleId, descriptionId] = supportCode.split('-');

	const mod = wiiuSupportCodes[moduleId]; // * `module` is reserved

	if (!mod || !mod.codes[descriptionId]) {
		return;
	}

	const code = localeJSON.wiiu[moduleId][descriptionId];

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

function get3DSSupportCodeInfo(supportCode, localeJSON) {
	const [moduleId, descriptionId] = supportCode.split('-');

	const mod = threeDSSupportCodes[moduleId]; // * `module` is reserved

	if (!mod || !mod.codes[descriptionId]) {
		return;
	}

	const code = localeJSON.3ds[moduleId][descriptionId];

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

function getPretendoSupportCodeInfo(supportCode, localeJSON) {
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

	const code = localeJSON.pretendo[moduleId][codeId];

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

module.exports = {
	checkForErrorCode
};
