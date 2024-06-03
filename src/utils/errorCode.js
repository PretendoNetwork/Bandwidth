const Discord = require('discord.js');
const errors = require('@pretendonetwork/error-codes');

const WIIU_SUPPORT_CODE_REGEX = /(\b1\d{2}-\d{4}\b)/gm;
const THREE_DS_SUPPORT_CODE_REGEX = /(\b0\d{2}-\d{4}\b)/gm;
// * There is probably a better way to do this regex
const PRETENDO_SUPPORT_CODE_REGEX = /(\b678-\d{4}\b|\b598-\d{4}\b|\b727-\d{4}\b)/gm; // * 678 = Martini, 598 = Juxtaposition, 727 = PNID Account

/**
 *
 * @param {String}} message
 */
function checkForErrorCode(text) {
	let embed;
	let error;

	// * Run this check first to avoid WiiU conflicts
	if (PRETENDO_SUPPORT_CODE_REGEX.test(text)) {
		error = text.match(PRETENDO_SUPPORT_CODE_REGEX)[0];
		embed = getPretendoEmbed(error);
	}

	if (WIIU_SUPPORT_CODE_REGEX.test(text)) {
		error = text.match(WIIU_SUPPORT_CODE_REGEX)[0];
		embed = getWiiUEmbed(error);
	}

	if (THREE_DS_SUPPORT_CODE_REGEX.test(text)) {
		error = text.match(THREE_DS_SUPPORT_CODE_REGEX)[0];
		embed = get3DSEmbed(error);
	}

	if (embed) {
		const [ sysmodule, errorCode ] = error.split('-');

		const errorInfo = errors.getErrorInfo(sysmodule, errorCode, 'en_US'); // TODO - Custom locale?

		if (!errorInfo) {
			return;
		}

		if (error.startsWith('1')) {
			embed.setTitle(`${error} (Wii U)`);
		} else if (error.startsWith('0')) {
			embed.setTitle(`${error} (3DS/2DS)`);
		} else {
			embed.setTitle(error);
		}

		embed.setURL(errorInfo.support_link);
		embed.setDescription(`${errorInfo.module.system} support code detected\nInformation is WIP and may be missing/incorrect\n\n${errorInfo.support_link}`);
		embed.setFields([
			{
				name: 'Module Name',
				value: errorInfo.module.name,
				inline: true
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: true
			},
			{
				name: 'Module Description',
				value: errorInfo.module.description,
				inline: true
			},
			{
				name: 'Error Name',
				value: `\`${errorInfo.name}\``,
				inline: true
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: true
			},
			{
				name: 'Error Description',
				value: errorInfo.short_description,
				inline: true
			},
			{
				name: 'Solution',
				value: errorInfo.short_solution
			},
			{
				name: 'Console dialog message',
				value: `\`\`\`\n${errorInfo.message}\n\`\`\``
			}
		]);
	}

	return embed;
}

function getWiiUEmbed() {
	const embed = new Discord.EmbedBuilder();

	embed.setColor(0x009AC7);

	return embed;
}

function get3DSEmbed() {
	const embed = new Discord.EmbedBuilder();

	embed.setColor(0xD12228);

	return embed;
}

function getPretendoEmbed() {
	const embed = new Discord.EmbedBuilder();

	embed.setColor(0x131733);

	return embed;
}

module.exports = {
	checkForErrorCode
};