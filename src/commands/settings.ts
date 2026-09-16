import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { getGuildSetting, updateGuildSetting } from '@/database';
import type { ServerSettings } from '@/types/db-types';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { CommandHandler } from '@/types/general-types';

const editableOptions = [
	'admin_role_id',
	'head_mod_role_id',
	'unverified_role_id',
	'developer_role_id',
	'mod_applications_channel_id',
	'vc_mod_apps_channel_id',
	'forum_mod_apps_channel_id',
	'network_mod_apps_channel_id',
	'juxt_mod_apps_channel_id',
	'reports_channel_id',
	'readme_channel_id',
	'rules_channel_id',
	'stats_members_channel_id',
	'stats_people_channel_id',
	'stats_bots_channel_id',
	'uploaded_network_dumps_channel_id',
	'ay_lmao_disabled'
];

function verifyInputtedKey(key: string | null): asserts key is keyof ServerSettings {
	if (!key || !editableOptions.includes(key)) {
		throw new Error('Cannot edit this setting - not a valid setting');
	}
}

async function settingsHandler(interaction: ChatInputCommandInteraction): Promise<void> {
	const guildId = interaction.guildId!;
	const key = interaction.options.getString('key');

	if (interaction.options.getSubcommand() === 'get') {
		verifyInputtedKey(key);

		const value = await getGuildSetting(guildId, key);

		// this is hellish string concatenation, I know
		await interaction.reply({
			content:
				'```\n' + key + '=' + '\'' + `${value}` + '\'' + '\n```',
			flags: MessageFlags.Ephemeral,
			allowedMentions: {
				parse: [] // * Dont allow tagging anything
			}
		});
		return;
	}

	if (interaction.options.getSubcommand() === 'set') {
		verifyInputtedKey(key);

		await updateGuildSetting(guildId, key, interaction.options.getString('value')!);
		await interaction.reply({
			content: `setting \`${key}\` has been saved successfully`,
			flags: MessageFlags.Ephemeral,
			allowedMentions: {
				parse: [] // dont allow tagging anything
			}
		});
		return;
	}

	throw new Error('unhandled subcommand');
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
command.setName('settings');
command.setDescription('Setup the bot');
command.addSubcommand((cmd) => {
	cmd.setName('set');
	cmd.setDescription('Change a settings key');
	cmd.addStringOption((option) => {
		option.setName('key');
		option.setDescription('Key to modify');
		option.setRequired(true);

		for (const setting of editableOptions) {
			option.addChoices({
				name: setting,
				value: setting
			});
		}
		return option;
	});
	cmd.addStringOption((option) => {
		option.setName('value');
		option.setDescription('value to set the setting to');
		option.setRequired(true);
		return option;
	});
	return cmd;
});
command.addSubcommand((cmd) => {
	cmd.setName('get');
	cmd.setDescription('Get value of settings key');
	cmd.addStringOption((option) => {
		option.setName('key');
		option.setDescription('Key to modify');
		option.setRequired(true);

		for (const setting of editableOptions) {
			option.addChoices({
				name: setting,
				value: setting
			});
		}
		return option;
	});
	return cmd;
});

const handler: CommandHandler = {
	name: command.name,
	help: 'Change settings of the bot',
	handler: settingsHandler,
	deploy: command.toJSON()
};

export default handler;
