const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const { db_path } = require('../config.json');

let database;

async function connect() {
	database = await sqlite.open({
		filename: path.join(__dirname, '..', db_path ?? 'database.db'),
		driver: sqlite3.Database
	});

	await database.run(`CREATE TABLE IF NOT EXISTS server_settings (
		guild_id TEXT,
		admin_role_id TEXT,
		head_mod_role_id TEXT,
		unverified_role_id TEXT,
		developer_role_id TEXT,
		mod_applications_channel_id TEXT,
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

	// This adds an ay_lmao_disabled column to the server settings table, if missing.
	let hasAyLmaoColumn = false;
	await database.each('SELECT * FROM pragma_table_info(\'server_settings\')', (_err, row) => {
		if (row.name === 'ay_lmao_disabled') hasAyLmaoColumn = true;
	});

	if (!hasAyLmaoColumn) {
		await database.run('ALTER TABLE server_settings ADD ay_lmao_disabled INTEGER DEFAULT 0 NOT NULL;');
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

async function initGuild(guildId) {
	await database.run('INSERT OR IGNORE INTO server_settings(guild_id) VALUES(?)', [ guildId ]);
}

async function getGuildSetting(guildId, name) {
	return (await database.get(`SELECT ${name} FROM server_settings WHERE guild_id=?`, [ guildId ]))[name];
}

async function updateGuildSetting(guildId, name, value) {
	await database.run(`UPDATE server_settings SET ${name}=? WHERE guild_id=?`, [ value, guildId ]);
}

async function checkAutomaticHelpDisabled(guildId, memberId) {
	const result = await database.get('SELECT EXISTS (SELECT 1 FROM nlp_disabled WHERE guild_id=? AND member_id=? LIMIT 1)', [ guildId, memberId ]);
	return Object.values(result)[0]; // * Hack. sqlite returns objects not values, need to get the value from the object
}

async function disableAutomaticHelp(guildId, memberId) {
	await database.run('INSERT OR IGNORE INTO nlp_disabled(guild_id, member_id) VALUES(?, ?)', [ guildId, memberId ]);
}

async function enabledAutomaticHelp(guildId, memberId) {
	await database.run('DELETE FROM nlp_disabled WHERE guild_id=? AND member_id=?', [ guildId, memberId ]);
}

async function checkAyLmaoDisabled(guildId) {
	const result = await database.get('SELECT ay_lmao_disabled FROM server_settings WHERE guild_id=? LIMIT 1', [ guildId ]);
	return Boolean(result.ay_lmao_disabled);
}

async function initMemberCooldown(memberId, commandId) {
	await database.run('INSERT OR IGNORE INTO command_cooldowns(member_id, command_id, cooldown) VALUES(?, ?, ?)', [ memberId, commandId, 0]);
}

async function updateCommandCooldown(memberId, commandId, cooldown) {
	await database.run('UPDATE command_cooldowns SET cooldown=? WHERE member_id=? AND command_id=?', [ cooldown, memberId, commandId ]);
}

async function getCommandCooldown(memberId, commandId) {
	return (await database.get('SELECT cooldown FROM command_cooldowns WHERE member_id=? AND command_id=?', [ memberId, commandId ]))['cooldown'];
}

async function createPoll(guildId, pollId, channelId, title, expiryTime, options) {
	await database.run('INSERT OR IGNORE INTO polls(guild_id, poll_id, channel_id, title, expiry_time, options) VALUES(?, ?, ?, ?, ?, ?)',  [ guildId, pollId, channelId, title, Number(expiryTime.toString().padEnd(13, '0')), JSON.stringify(options)]);
}

async function votePoll(memberId, pollId, vote) {
	const result = await database.get('SELECT votes, voters FROM polls WHERE poll_id=?', [ pollId ]);
	const votes = JSON.parse(Object.values(result)[0]);
	const voters = JSON.parse(Object.values(result)[1]);

	if (!voters.includes(memberId)) {
		votes[vote] += 1;
		voters.push(memberId);

		await database.run('UPDATE polls SET votes = ?, voters = ? WHERE poll_id=?', [ JSON.stringify(votes), JSON.stringify(voters), pollId ]);

		return true;
	} else {
		return false;
	}
}

async function getPollInfo(pollId) {
	const result = await database.get('SELECT title, options, votes, expiry_time FROM polls WHERE poll_id=?', [ pollId ]);

	const title = Object.values(result)[0];
	const options = JSON.parse(Object.values(result)[1]);
	const votes = JSON.parse(Object.values(result)[2]);
	const expiryTime = Number(Object.values(result)[3]);

	return { title, options, votes, expiryTime };
}

async function getAllPollInfo() {
	const polls = [];

	await database.each('SELECT poll_id, channel_id, title, options, votes, expiry_time FROM polls', (_, row) => {
		const pollId = Object.values(row)[0];
		const channelId = Object.values(row)[1];
		const title = Object.values(row)[2];
		const options = JSON.parse(Object.values(row)[3]);
		const votes = JSON.parse(Object.values(row)[4]);
		const expiryTime = Number(Object.values(row)[5]);

		polls.push({ pollId, channelId, title, options, votes, expiryTime });
	});

	return polls;
}

async function closePoll(pollId) {
	await database.run('DELETE FROM polls WHERE poll_id=?', [ pollId ]);
}

async function doesPollExist(pollId) {
	const poll = await database.get('SELECT COUNT(*) FROM polls WHERE poll_id=? LIMIT 1', [ pollId ]);
	if (Object.values(poll)[0] === 0) {
		return false;
	} else {
		return true;
	}
}

async function createRule(guildId, title, description, time) {
	await database.run('INSERT INTO rules(guild_id, title, description, time) VALUES(?, ?, ?, ?)', [ guildId, title, description, time ]);
}

async function updateRule(guildId, id, title, description, time) {
	await database.run('INSERT OR REPLACE INTO rules(guild_id, id, title, description, time) VALUES(?, ?, ?, ?, ?)', [ guildId, id, title, description, time ]);
}

async function getRule(guildId, ruleId) {
	return (await database.get('SELECT id, title, description, time FROM rules WHERE guild_id=? AND id=?', [ guildId, ruleId ]));
}

async function getAllRules(guildId) {
	return (await database.all('SELECT id, title, description, time FROM rules WHERE guild_id=?', [ guildId ]));
}

async function removeRule(guildId, ruleId) {
	await database.run('DELETE FROM rules WHERE guild_id=? AND id=?', [ guildId, ruleId ]);
}

module.exports = {
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