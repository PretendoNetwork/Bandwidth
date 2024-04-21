const Discord = require('discord.js');
const cooldownUtils = require('../utils/cooldown');

/**
 *
 * @param {Discord.ChatInputCommandInteraction} interaction
 */
async function chatInputCommandHandler(interaction) {
	const { commandName } = interaction;

	/** @type {Discord.Collection} */
	const commands = interaction.client.commands;
	const command = commands.get(commandName);
	const memberId = interaction.member.id;

	// do nothing if no command
	if (!command) {
		throw new Error(`Missing command handler for \`${commandName}\``);
	}

	// check for cooldown and run the command
	const cooldown = await cooldownUtils.isInteractionOnCooldown(command, memberId);
	if (!cooldown) {
		await command.handler(interaction);
		if (command.cooldown) { 
			cooldownUtils.beginCooldown(command, memberId);
		}
	} else {
		await interaction.reply(
			{
				embeds: [cooldown],
				ephemeral: true
			}
		);
	}
}

module.exports = chatInputCommandHandler;