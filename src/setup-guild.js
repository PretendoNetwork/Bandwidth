const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const timedUtils = require('./utils/timed');
const database = require('./database');
const { bot_token: botToken } = require('../config.json');
const rest = new REST({ version: '10' }).setToken(botToken);


/**
 *
 * @param {Discord.Guild} guild
 */
async function setupGuild(guild) {
	// do nothing if the bot does not have the correct permissions
	if (!guild.members.me.permissions.has([Discord.PermissionFlagsBits.ManageChannels])) {
		console.log('Bot does not have permissions to set up in guild', guild.name);
		return;
	}

	// Setup commands
	await deployCommandsToGuild(guild);

	try {
		await timedUtils.updateMemberCountChannels(guild);
	} catch {
		// we dont care if it fails on setup, it'll sync again on join
	}

	// Set up our timer for refreshing the member count (5 minutes)
	setInterval(async function(){
		await timedUtils.updateMemberCountChannels(guild);
	}, 300000);

	await database.initGuild(guild.id);
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function deployCommandsToGuild(guild) {
	const deploy = [];

	guild.client.commands.forEach((command) => {
		deploy.push(command.deploy);
	});

	guild.client.contextMenus.forEach((contextMenu) => {
		deploy.push(contextMenu.deploy);
	});


	await rest.put(Routes.applicationGuildCommands(guild.members.me.id, guild.id), {
		body: deploy,
	});
}

module.exports = {
	setupGuild,
};
