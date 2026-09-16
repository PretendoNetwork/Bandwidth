import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open as openSQLite } from 'sqlite';
import { db_path } from '@/../config.json';
import type { Database } from 'sqlite';
import type { PollInfo } from '@/types/general-types';
import type { CommandCooldown, Poll, PragmaTableInfo, Rule, ServerSettings } from '@/types/db-types';

let database: Database;

const resolvedDbPath = db_path ?? path.join(__dirname, '../database.db');
const dbFolder = path.dirname(resolvedDbPath);
fs.mkdirSync(dbFolder, { recursive: true });

async function connect(): Promise<void> {
	database = await openSQLite({
		filename: resolvedDbPath,
		driver: sqlite3.Database
	});

	await database.run(`CREATE TABLE IF NOT EXISTS server_settings (
		guild_id TEXT,
		admin_role_id TEXT,
		head_mod_role_id TEXT,
		unverified_role_id TEXT,
		developer_role_id TEXT,
		mod_applications_channel_id TEXT,
		vc_mod_apps_channel_id TEXT,
		forum_mod_apps_channel_id TEXT,
		network_mod_apps_channel_id TEXT,
		juxt_mod_apps_channel_id TEXT,
		reports_channel_id TEXT,
		readme_channel_id TEXT,
		rules_channel_id TEXT,
		stats_members_channel_id TEXT,
		stats_people_channel_id TEXT,
		stats_bots_channel_id TEXT,
		uploaded_network_dumps_channel_id TEXT,
		ay_lmao_disabled INTEGER DEFAULT 0 NOT NULL,
		UNIQUE(guild_id)
	)`);

	// This adds items to the server settings table, if missing.
	let hasAyLmaoColumn = false;
	let hasVCModApps = false;
	let hasForumModApps = false;
	let hasNetworkModApps = false;
	let hasJuxtModApps = false;
	await database.each('SELECT * FROM pragma_table_info(\'server_settings\')', (_err, row: PragmaTableInfo) => {
		switch (row.name) {
			case 'ay_lmao_disabled':
				hasAyLmaoColumn = true;
				break;
			case 'vc_mod_apps_channel_id':
				hasVCModApps = true;
				break;
			case 'forum_mod_apps_channel_id':
				hasForumModApps = true;
				break;
			case 'network_mod_apps_channel_id':
				hasNetworkModApps = true;
				break;
			case 'juxt_mod_apps_channel_id':
				hasJuxtModApps = true;
				break;
		}
	});

	if (!hasAyLmaoColumn) {
		await database.run('ALTER TABLE server_settings ADD ay_lmao_disabled INTEGER DEFAULT 0 NOT NULL;');
	}
	if (!hasVCModApps) {
		await database.run('ALTER TABLE server_settings ADD vc_mod_apps_channel_id TEXT;');
	}
	if (!hasForumModApps) {
		await database.run('ALTER TABLE server_settings ADD forum_mod_apps_channel_id TEXT;');
	}
	if (!hasNetworkModApps) {
		await database.run('ALTER TABLE server_settings ADD network_mod_apps_channel_id TEXT;');
	}
	if (!hasJuxtModApps) {
		await database.run('ALTER TABLE server_settings ADD juxt_mod_apps_channel_id TEXT;');
	}

	await database.run(`CREATE TABLE IF NOT EXISTS nlp_disabled (
		guild_id TEXT,
		member_id TEXT,
		UNIQUE(guild_id, member_id)
	)`);

	await database.run(`CREATE TABLE IF NOT EXISTS command_cooldowns (
		member_id TEXT,
		command_id TEXT,
		cooldown TEXT,
		UNIQUE(member_id, command_id)
	)`);

	await database.run(`CREATE TABLE IF NOT EXISTS polls (
		guild_id TEXT,
		poll_id TEXT,
		channel_id TEXT,
		title TEXT,
		expiry_time TEXT,
		options TEXT,
		votes TEXT DEFAULT '[0,0,0,0,0]',
		voters TEXT DEFAULT '[]',
		UNIQUE(guild_id, poll_id)
	)`);

	await database.run(`CREATE TABLE IF NOT EXISTS rules (
		guild_id TEXT,
		id INTEGER PRIMARY KEY,
		title TEXT,
		description TEXT,
		time NUMBER,
		UNIQUE(guild_id, id)
	)`);
}

async function initGuild(guildId: string): Promise<void> {
	await database.run('INSERT OR IGNORE INTO server_settings(guild_id) VALUES(?)', [guildId]);
}

async function getGuildSetting<K extends keyof ServerSettings>(guildId: string, name: K): Promise<ServerSettings[K]> {
	const result = await database.get<ServerSettings>(`SELECT ${name} FROM server_settings WHERE guild_id=?`, [guildId]);
	return result?.[name] as ServerSettings[K];
}

async function updateGuildSetting<K extends keyof ServerSettings>(guildId: string, name: K, value: ServerSettings[K]): Promise<void> {
	await database.run(`UPDATE server_settings SET ${name}=? WHERE guild_id=?`, [value, guildId]);
}

async function checkAutomaticHelpDisabled(guildId: string, memberId: string): Promise<boolean> {
	const result = await database.get<object>('SELECT EXISTS (SELECT 1 FROM nlp_disabled WHERE guild_id=? AND member_id=? LIMIT 1)', [guildId, memberId]);
	return Boolean(Object.values(result!)[0]); // * Hack. sqlite returns objects not values, need to get the value from the object
}

async function disableAutomaticHelp(guildId: string, memberId: string): Promise<void> {
	await database.run('INSERT OR IGNORE INTO nlp_disabled(guild_id, member_id) VALUES(?, ?)', [guildId, memberId]);
}

async function enabledAutomaticHelp(guildId: string, memberId: string): Promise<void> {
	await database.run('DELETE FROM nlp_disabled WHERE guild_id=? AND member_id=?', [guildId, memberId]);
}

async function checkAyLmaoDisabled(guildId: string): Promise<boolean> {
	const result = await database.get<ServerSettings>('SELECT ay_lmao_disabled FROM server_settings WHERE guild_id=? LIMIT 1', [guildId]);
	return Boolean(result?.ay_lmao_disabled);
}

async function initMemberCooldown(memberId: string, commandId: string): Promise<void> {
	await database.run('INSERT OR IGNORE INTO command_cooldowns(member_id, command_id, cooldown) VALUES(?, ?, ?)', [memberId, commandId, 0]);
}

async function updateCommandCooldown(memberId: string, commandId: string, cooldown: number): Promise<void> {
	await database.run('UPDATE command_cooldowns SET cooldown=? WHERE member_id=? AND command_id=?', [cooldown, memberId, commandId]);
}

async function getCommandCooldown(memberId: string, commandId: string): Promise<number | undefined> {
	const result = await database.get<CommandCooldown>('SELECT cooldown FROM command_cooldowns WHERE member_id=? AND command_id=?', [memberId, commandId]);
	return result && Number(result.cooldown);
}

async function createPoll(guildId: string | null, pollId: string, channelId: string, title: string, expiryTime: string, options: string[]): Promise<void> {
	await database.run('INSERT OR IGNORE INTO polls(guild_id, poll_id, channel_id, title, expiry_time, options) VALUES(?, ?, ?, ?, ?, ?)', [guildId, pollId, channelId, title, Number(expiryTime.toString().padEnd(13, '0')), JSON.stringify(options)]);
}

async function votePoll(memberId: string, pollId: string, vote: number): Promise<boolean> {
	const result = await database.get<Poll>('SELECT votes, voters FROM polls WHERE poll_id=?', [pollId]);

	if (!result) {
		throw new Error(`Poll ${pollId} not found`);
	}

	const votes = JSON.parse(result.votes) as number[];
	const voters = JSON.parse(result.voters) as string[]; // TODO verify

	if (!voters.includes(memberId)) {
		votes[vote] += 1;
		voters.push(memberId);

		await database.run('UPDATE polls SET votes = ?, voters = ? WHERE poll_id=?', [JSON.stringify(votes), JSON.stringify(voters), pollId]);

		return true;
	} else {
		return false;
	}
}

async function getPollInfo(pollId: string): Promise<Omit<PollInfo, 'channelId'>> {
	const poll = await database.get<Poll>('SELECT title, options, votes, expiry_time FROM polls WHERE poll_id=?', [pollId]);

	if (!poll) {
		throw new Error(`Poll ${pollId} not found`);
	}

	return {
		pollId,
		title: poll.title,
		options: JSON.parse(poll.options) as string[],
		votes: JSON.parse(poll.votes) as number[],
		expiryTime: Number(poll.expiry_time)
	};
}

async function getAllPollInfo(): Promise<PollInfo[]> {
	const polls: PollInfo[] = [];

	await database.each<Poll>('SELECT poll_id, channel_id, title, options, votes, expiry_time FROM polls', (_, row) => {
		polls.push({
			pollId: row.poll_id,
			channelId: row.channel_id,
			title: row.title,
			options: JSON.parse(row.options) as string[],
			votes: JSON.parse(row.votes) as number[],
			expiryTime: Number(row.expiry_time)
		});
	});

	return polls;
}

async function closePoll(pollId: string): Promise<void> {
	await database.run('DELETE FROM polls WHERE poll_id=?', [pollId]);
}

async function doesPollExist(pollId: string): Promise<boolean> {
	const poll = await database.get<object>('SELECT COUNT(*) FROM polls WHERE poll_id=? LIMIT 1', [pollId]);
	return Object.values(poll!)[0] !== 0;
}

async function createRule(guildId: string, title: string, description: string, time: string): Promise<void> {
	await database.run('INSERT INTO rules(guild_id, title, description, time) VALUES(?, ?, ?, ?)', [guildId, title, description, time]);
}

async function updateRule(guildId: string, id: number, title: string, description: string, time: string): Promise<void> {
	await database.run('INSERT OR REPLACE INTO rules(guild_id, id, title, description, time) VALUES(?, ?, ?, ?, ?)', [guildId, id, title, description, time]);
}

async function getRule(guildId: string, ruleId: string): Promise<Rule | undefined> {
	return (await database.get<Rule>('SELECT id, title, description, time FROM rules WHERE guild_id=? AND id=?', [guildId, ruleId]));
}

async function getAllRules(guildId: string): Promise<Rule[]> {
	return (await database.all<Rule[]>('SELECT id, title, description, time FROM rules WHERE guild_id=?', [guildId]));
}

async function removeRule(guildId: string, ruleId: string): Promise<void> {
	await database.run('DELETE FROM rules WHERE guild_id=? AND id=?', [guildId, ruleId]);
}

export {
	connect,
	initGuild,
	getGuildSetting,
	updateGuildSetting,
	checkAutomaticHelpDisabled,
	disableAutomaticHelp,
	enabledAutomaticHelp,
	checkAyLmaoDisabled,
	initMemberCooldown,
	updateCommandCooldown,
	getCommandCooldown,
	createPoll,
	votePoll,
	getPollInfo,
	getAllPollInfo,
	closePoll,
	doesPollExist,
	createRule,
	updateRule,
	getRule,
	removeRule,
	getAllRules
};
