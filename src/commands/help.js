const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

function hasSendMessagesPermission(permission) {
	return BigInt(permission) & Discord.PermissionFlagsBits.SendMessages;
}

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function helpHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const commandName = interaction.options.getString('command');

	const helpEmbed = new Discord.EmbedBuilder();
	helpEmbed.setColor(0x287E29);
	helpEmbed.setTitle('Pretendo Network Help');
	helpEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild.iconURL()
	});

	if (!commandName) {
		const commandNames = [...interaction.client.commands.filter(command => hasSendMessagesPermission(command.deploy.default_member_permissions)).keys()];
		const contextMenuNames = [...interaction.client.contextMenus.filter(command => hasSendMessagesPermission(command.deploy.default_member_permissions)).keys()];

		helpEmbed.setDescription('To get detailed information about a command, use `/help <command name>` or `/<command name>` to check the commands description\n\nAll commands are Discord application commands with ephemeral (only visible to you) responses. Context Menu commands are visible via right clicking on a message or user and navigating to `Apps > <command name>`');
		helpEmbed.setFields([
			{
				'name': 'Commands',
				'value': `\`\`\`\n${commandNames.join('\n')}\`\`\``,
				'inline': true
			},
			{
				'name': 'Context Menus',
				'value': `\`\`\`\n${contextMenuNames.join('\n')}\`\`\``,
				'inline': true
			}
		]);
	} else {
		const [collection, key] = commandName.split(':');

		helpEmbed.setFields([
			{
				'name': key,
				'value': interaction.client[collection].get(key).help
			}
		]);
	}

	await interaction.followUp({
		embeds: [helpEmbed],
		ephemeral: true
	});
}

const command = new SlashCommandBuilder();

command.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages);
command.setName('help');
command.setDescription('Get help');
command.addStringOption(option => {
	option.setName('command');
	option.setDescription('Command Name');
	option.setRequired(false);
	option.addChoices(
		{ name: '/help', value: 'commands:help' },
		{ name: '/mod-application', value: 'commands:mod-application' },
		{ name: '/togglerole', value: 'commands:togglerole' },
		{ name: '/upload-network-dump', value: 'commands:upload-network-dump' },
		{ name: 'Report User', value: 'contextMenus:Report User' },
		{ name: 'Warn Piracy', value: 'contextMenus:Warn Piracy' }
	);

	return option;
});

module.exports = {
	name: command.name,
	help: 'Get detailed help about the server and commands.\n```\nUsage: /help <command>\n```',
	handler: helpHandler,
	deploy: command.toJSON()
};