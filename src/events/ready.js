const Discord = require('discord.js');
const glob = require('glob');
const path = require('path');
const database = require('../database');
const pollUtils = require('../utils/polls');
const { setupGuild } = require('../setup-guild');


/**train
 *
 * @param {Discord.Client} client
 */
async function readyHandler(client) {
	await database.connect();

	loadBotHandlersCollection('buttons', client.buttons);
	loadBotHandlersCollection('commands', client.commands);
	loadBotHandlersCollection('context-menus', client.contextMenus);
	loadBotHandlersCollection('modals', client.modals);
	loadBotHandlersCollection('select-menus', client.selectMenus);

	console.log('Registered global commands');

	// setup joined guilds
	const guilds = await client.guilds.fetch();

	for (const id of guilds.keys()) {
		const guild = await guilds.get(id).fetch();

		await setupGuild(guild);
		console.log(`setup guild: ${guild.name}`);
	}

	// Start poll refreshing for every minute
	setInterval(async function() {
		await pollUtils.updatePolls(client);
	}, 60000);

	console.log(`Logged in as ${client.user.tag}`);
}

/**
 *
 * @param {String} name
 * @param {Discord.Collection} collection
 */
function loadBotHandlersCollection(name, collection) {
	const files = glob.sync(`${__dirname}/../${name}/**/*.js`);

	for (const file of files) {
		const handler = require(path.resolve(file));

		collection.set(handler.name, handler);
	}
}

module.exports = readyHandler;