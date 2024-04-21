const Discord = require('discord.js');
const database = require('../database');

/**
 *
 * @param {Discord.CommandInteraction} command
 * @param {Number} memberId
 */
async function isInteractionOnCooldown(command, memberId) {
	if (!command.cooldown) {
		return false;
	}

	// Initialize our cooldown if not already and grab the cooldown
	await database.initMemberCooldown(memberId, command.name);
	const cooldown = await database.getCommandCooldown(memberId, command.name);

	// Check if we are still on cooldown or if there has never been a cooldown for this command yet
	if (cooldown == 0 || Date.now() > cooldown) {
		return false;
	}

	const cooldownEmbed = new Discord.EmbedBuilder();
	const relativeTime = getRelativeTime(parseInt(cooldown));

	cooldownEmbed.setColor(0xF36F8A);
	cooldownEmbed.setTitle('Cooldown!');
	cooldownEmbed.setDescription('Sorry, that action is on cooldown right now.');
	cooldownEmbed.setFooter({ text: `Expires ${relativeTime}` });

	// Return an embed back rather than false that will be used to show we're on cooldown
	return cooldownEmbed;
}

/**
 *
 * @param {Discord.CommandInteraction} command
 * @param {Number} memberId
 */
async function beginCooldown(command, memberId) {
	const endTime = (new Date(Date.now() + command.cooldown).getTime());

	await database.updateCommandCooldown(memberId, command.name, endTime);
}

function getRelativeTime(timestamp) {

	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	const elapsed = Number(timestamp.toString().padEnd(13, '0')) - Date.now();

	if (elapsed < msPerMinute) {
		return `in ${Math.round(elapsed/1000)} second(s)`;
	}

	else if (elapsed < msPerHour) {
		return `in ${Math.round(elapsed/msPerMinute)} minute(s)`;
	}

	else if (elapsed < msPerDay ) {
		return `in ${Math.round(elapsed/msPerHour)} hour(s)`;
	}

	else if (elapsed < msPerMonth) {
		return `in ${Math.round(elapsed/msPerDay)} day(s)`;
	}

	else if (elapsed < msPerYear) {
		return `in ${Math.round(elapsed/msPerMonth)} month(s)`;
	}

	else {
		return `in ${Math.round(elapsed/msPerYear)} year(s)`;
	}
}

module.exports = {
	isInteractionOnCooldown,
	beginCooldown,
	getRelativeTime
};