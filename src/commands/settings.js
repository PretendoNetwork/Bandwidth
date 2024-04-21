const Discord = require('discord.js');
const database = require('../database');
const { SlashCommandBuilder } = require('@discordjs/builders');

const editableOptions = [
	'admin_role_id',
	'unverified_role_id',
	'developer_role_id',
	'mod_applications_channel_id',
	'reports_channel_id',
	'readme_channel_id',
	'rules_channel_id',
	'stats_members_channel_id',
	'stats_people_channel_id',
	'stats_bots_channel_id',
	'uploaded_network_dumps_channel_id',
	'ay_lmao_disabled'
];

async function verifyInputtedKey(interaction) {
	const key = interaction.options.getString('key');
	if (!editableOptions.includes(key)) {
		throw new Error('Cannot edit this setting - not a valid setting');
	}
}

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function settingsHandler(interaction) {
	const { guildId } = interaction;
	const key = interaction.options.getString('key');

	if (interaction.options.getSubcommand() === 'get') {
		await verifyInputtedKey(interaction);

		const value = await database.getGuildSetting(guildId, key);

		// this is hellish string concatenation, I know
		await interaction.reply({
			content:
				'```\n' + key + '=' + '\'' + `${value}` + '\'' + '\n```',
			ephemeral: true,
			allowedMentions: {
				parse: [], // * Dont allow tagging anything
			},
		});
		return;
	}

	if (interaction.options.getSubcommand() === 'set') {
		await verifyInputtedKey(interaction);

		await database.updateGuildSetting(guildId, key, interaction.options.getString('value'));
		await interaction.reply({
			content: `setting \`${key}\` has been saved successfully`,
			ephemeral: true,
			allowedMentions: {
				parse: [], // dont allow tagging anything
			},
		});
		return;
	}

	throw new Error('unhandled subcommand');
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);
command.setName('settings');
command.setDescription('Setup the bot');
command.addSubcommand((cmd) => {
	cmd.setName('set');
	cmd.setDescription('Change a settings key');
	cmd.addStringOption((option) => {
		option.setName('key');
		option.setDescription('Key to modify');
		option.setRequired(true);

		for (const setting in editableOptions) {
			option.addChoices({
				name: editableOptions[setting],
				value: editableOptions[setting]
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

		for (const setting in editableOptions) {
			option.addChoices({
				name: editableOptions[setting],
				value: editableOptions[setting]
			});
		}
		return option;
	});
	return cmd;
});

module.exports = {
	name: command.name,
	help: 'Change settings of the bot',
	handler: settingsHandler,
	deploy: command.toJSON(),
};
