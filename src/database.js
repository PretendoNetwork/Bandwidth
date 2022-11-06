const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let database;

async function connect() {
	database = await sqlite.open({
		filename: path.join(__dirname, '../database.db'),
		driver: sqlite3.Database
	});

	await database.exec(`CREATE TABLE IF NOT EXISTS server_settings (
		guild_id TEXT,
		admin_role_id TEXT,
		mod_applications_channel_id TEXT,
		reports_channel_id TEXT,
		readme_channel_id TEXT,
		rules_channel_id TEXT,
		stats_members_channel_id TEXT,
		stats_people_channel_id TEXT,
		stats_bots_channel_id TEXT,
		error_channel_id TEXT,
		UNIQUE(guild_id)
	)`);

	await database.exec(`CREATE TABLE IF NOT EXISTS nlp_disabled (
		guild_id TEXT,
		member_id TEXT,
		UNIQUE(guild_id, member_id)
	)`);
}

async function initGuild(guildId) {
	await database.exec(`INSERT OR IGNORE INTO server_settings(guild_id) VALUES(${guildId})`);
}

async function getGuildSetting(guildId, name) {
	return (await database.get(`SELECT ${name} FROM server_settings WHERE guild_id=${guildId}`))[name];
}

async function updateGuildSetting(guildId, name, value) {
	await database.exec(`UPDATE server_settings SET ${name}=${value} WHERE guild_id=${guildId}`);
}

async function checkAutomaticHelpDisabled(guildId, memberId) {
	const result = await database.get(`SELECT EXISTS (SELECT 1 FROM nlp_disabled WHERE guild_id=${guildId} AND member_id=${memberId} LIMIT 1)`);
	return Object.values(result)[0]; // * Hack. sqlite returns objects not values, need to get the value from the object
}

async function disableAutomaticHelp(guildId, memberId) {
	await database.exec(`INSERT OR IGNORE INTO nlp_disabled(guild_id, member_id) VALUES(${guildId}, ${memberId})`);
}

async function enabledAutomaticHelp(guildId, memberId) {
	await database.exec(`DELETE FROM nlp_disabled WHERE guild_id=${guildId} AND member_id=${memberId}`);
}

module.exports = {
	connect,
	initGuild,
	getGuildSetting,
	updateGuildSetting,
	checkAutomaticHelpDisabled,
	disableAutomaticHelp,
	enabledAutomaticHelp
};
