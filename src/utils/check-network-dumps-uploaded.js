const path = require('node:path');
const Discord = require('discord.js');
const database = require('../database');

const HOKAKU_CAFE_TOKEN_BIN_REGEX = /nexServiceToken-\d*-[A-z0-9]*\.bin/;

/**
 *
 * @param {Discord.Message} message
 */
async function checkNetworkDumpsUploaded(message) {
	const developerRoleId = await database.getGuildSetting(message.guild.id, 'developer_role_id');

	if (message.member.roles.cache.has(developerRoleId)) {
		// * Ignore developer uploads
		return;
	}

	// * Scan messages for possible network dumps
	const networkDumps = [...message.attachments.filter(attachment => {
		if (attachment.name.match(HOKAKU_CAFE_TOKEN_BIN_REGEX)) {
			return attachment;
		}

		const fileExtension = path.extname(attachment.name.toLowerCase());

		if (
			fileExtension === '.har' ||   // * HTTP Archive dump
			fileExtension === '.chls' ||  // * Charles session
			fileExtension === '.chlsj' || // * Charles JSON summary
			fileExtension === '.chlsx' || // * Charles XML summary
			fileExtension === '.saz' ||   // * Fiddler session
			fileExtension === '.pcap' ||  // * PCAP
			fileExtension === '.pcapng'   // * PCAPNG
		) {
			return attachment;
		}
	}).values()];

	if (networkDumps.length === 0) {
		return;
	}

	await message.reply({
		content: 'Uploading network dumps with messages has been disabled for security reasons. Please use the new `/upload-network-dump` command. Your message has been deleted.'
	});

	await message.delete();
}

module.exports = {
	checkNetworkDumpsUploaded
};