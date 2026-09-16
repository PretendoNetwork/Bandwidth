import path from 'path';
import { glob } from 'glob';
import { ActivityType, PresenceUpdateStatus } from 'discord.js';
import { connect } from '@/database';
import { updatePolls } from '@/utils/polls';
import { setupGuild } from '@/setup-guild';
import type { BaseHandler } from '@/types/general-types';
import type { Client, Collection } from 'discord.js';

export default async function readyHandler(client: Client): Promise<void> {
	await connect();

	await Promise.all([
		loadBotHandlersCollection('buttons', client.buttons),
		loadBotHandlersCollection('commands', client.commands),
		loadBotHandlersCollection('context-menus', client.contextMenus),
		loadBotHandlersCollection('modals', client.modals),
		loadBotHandlersCollection('select-menus', client.selectMenus)
	]);

	console.log('Registered global commands');

	// setup joined guilds
	const guilds = await client.guilds.fetch();

	for (const oauthGuild of guilds.values()) {
		const guild = await oauthGuild.fetch();

		await setupGuild(guild);
		console.log(`setup guild: ${guild.name}`);
	}

	// Start poll refreshing for every minute
	setInterval(async function () {
		await updatePolls(client);
	}, 60000);

	console.log(`Logged in as ${client.user?.tag}`);

	_setRandomStatus(client);

	// set random status every 10 min
	setInterval(function () {
		_setRandomStatus(client);
	}, 10 * 60 * 1000);
}

const statuses = [
	'eating network cables 😋',
	'becoming marketable',
	'my aunt works at nintendo!',
	'amazing looking water in this game',
	'lgtm',
	'who needs PRs, commit to main',
	'join 🇨🇭 Tester+ today! real!',
	'y can\'t metroid crawl :(',
	'i wish squids were real',
	'trans rights btw',
	'no eta',
	'soon™',
	'soon™™™™™',
	'rules in #rules, the rules channel',
	'🤔 did you know we have a Forum',
	'🤯 did you know we have a Discord',
	'developer? i hardly know \'er!',
	'kills you with hammers',
	'purple for an amazing reason',
	'works on my machine',
	'furry = dev',
	'you did, in fact, use cheats',
	'ay lmao',
	'do not open Homebrew Community',
	'😳 /mod-application',
	'jom :3 is typing',
	'2038-01-19T03:14:08.000Z',
	'160-0103 w/ a side of Hynix chips'
];

function _setRandomStatus(client: Client): void {
	client?.user?.setPresence({ activities: [{ name: statuses[Math.floor(Math.random() * statuses.length)], type: ActivityType.Custom }], status: PresenceUpdateStatus.Online });
}

async function loadBotHandlersCollection(name: string, collection: Collection<string, BaseHandler>): Promise<void> {
	const globPattern = process.env.NODE_ENV === 'production'
		? `dist/${name}/**/*.js`
		: `src/${name}/**/*.ts`;

	const files = await glob(globPattern);

	await Promise.all(files.map(async (file) => {
		const handler = (await import(path.resolve(file))).default as BaseHandler;

		collection.set(handler.name, handler);
	}));
}
