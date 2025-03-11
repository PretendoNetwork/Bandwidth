const Discord = require('discord.js');
const database = require('../database');

/**
 *
 * @param {Discord.Guild} guild
 */
async function updateMemberCountChannels(guild) {

	const memberChannelId = await database.getGuildSetting(guild.id, 'stats_members_channel_id');
	const peopleChannelId = await database.getGuildSetting(guild.id, 'stats_people_channel_id');
	const botsChannelId = await database.getGuildSetting(guild.id, 'stats_bots_channel_id');

	const membersChannel = memberChannelId && await guild.channels.fetch(memberChannelId);
	const peopleChannel = memberChannelId && await guild.channels.fetch(peopleChannelId);
	const botsChannel = memberChannelId && await guild.channels.fetch(botsChannelId);

	const members = await guild.members.fetch();
	const membersCount = guild.memberCount;
	let peopleCount = 0;
	let botsCount = 0;

	// Only loop once
	members.forEach(member => {
		if (member.user.bot) {
			botsCount += 1;
		} else {
			peopleCount += 1;
		}
	});

	if (membersChannel) await membersChannel.setName(`Members - ${membersCount}`);
	if (peopleChannel) await peopleChannel.setName(`People - ${peopleCount}`);
	if (botsChannel) await botsChannel.setName(`Bots - ${botsCount}`);
}

module.exports = {
	updateMemberCountChannels
};