import { PermissionFlagsBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { updateMemberCountChannels } from '@/utils/timed';
import { initGuild } from '@/database';
import { bot_token as botToken } from '@/../config.json';
import type { Guild, RESTPostAPIBaseApplicationCommandsJSONBody } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(botToken);

export async function setupGuild(guild: Guild): Promise<void> {
	// do nothing if the bot does not have the correct permissions
	if (!guild.members.me?.permissions.has([PermissionFlagsBits.ManageChannels])) {
		console.log('Bot does not have permissions to set up in guild', guild.name);
		return;
	}

	// Setup commands
	await deployCommandsToGuild(guild);

	try {
		await updateMemberCountChannels(guild);
	} catch {
		// we dont care if it fails on setup, it'll sync again on join
	}

	// Set up our timer for refreshing the member count (5 minutes)
	setInterval(async function () {
		await updateMemberCountChannels(guild);
	}, 300000);

	await initGuild(guild.id);
}

async function deployCommandsToGuild(guild: Guild): Promise<void> {
	const deploy: RESTPostAPIBaseApplicationCommandsJSONBody[] = [];

	guild.client.commands.forEach((command) => {
		deploy.push(command.deploy);
	});

	guild.client.contextMenus.forEach((contextMenu) => {
		deploy.push(contextMenu.deploy);
	});

	await rest.put(Routes.applicationGuildCommands(guild.members.me!.id, guild.id), {
		body: deploy
	});
}
