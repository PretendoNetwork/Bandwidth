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
	setInterval(async function () {
		await pollUtils.updatePolls(client);
	}, 60000);

	console.log(`Logged in as ${client.user.tag}`);

	_setRandomStatus(client);

	// set random status every 10 min
	setInterval(async function () {
		_setRandomStatus(client);
	}, 10 * 60 * 1000);
}

async function _setRandomStatus(client) {
	const statuses = ['eating network cables 😋', 'becoming marketable', 'my aunt works at nintendo!', 'amazing looking water in this game', 'lgtm', 'who needs PRs, commit to main', 'join 🇨🇭 Tester+ today! real!', 'y can\'t metroid crawl :(', 'i wish squids were real', 'trans rights btw', 'no eta', 'soon™', 'soon™™™™™', 'rules in #rules, the rules channel', '🤔 did you know we have a Forum', '🤯 did you know we have a Discord', 'developer? i hardly know \'er!', 'kills you with hammers', 'purple for an amazing reason', 'works on my machine', 'furry = dev', 'you did, in fact, use cheats', 'ay lmao', 'do not open Homebrew Community', '😳 /mod-application', 'jom :3 is typing', '2038-01-19T03:14:08.000Z', '160-0103 w/ a side of Hynix chips'];
	client?.user?.setPresence({ activities: [{ name: statuses[Math.floor(Math.random() * statuses.length)], type: Discord.ActivityType.Custom }], status: Discord.PresenceUpdateStatus.Online });
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