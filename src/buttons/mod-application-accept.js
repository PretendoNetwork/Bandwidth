const Discord = require('discord.js');
const database = require('../database');

const acceptButton = new Discord.ButtonBuilder();
acceptButton.setCustomId('mod-application-accept');
acceptButton.setLabel('Accept');
acceptButton.setStyle(Discord.ButtonStyle.Success);

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function modApplicationAcceptHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const adminRoleId = await database.getGuildSetting(interaction.guildId, 'admin_role_id');

	if (!adminRoleId) {
		throw new Error('No admin role ID set!');
	}

	const hasdAdminRole = interaction.member.roles.cache.get(adminRoleId);

	if (!hasdAdminRole) {
		throw new Error('Only administrators have permission to accept/deny applications');
	}

	const { message } = interaction;
	const modApplicationEmbed = new Discord.EmbedBuilder(message.embeds[0].toJSON());
	const rowOld = message.components[0];
	const [acceptButtonOld, denyButtonOld] = rowOld.components;

	modApplicationEmbed.setColor(0x6FF38E);
	modApplicationEmbed.setImage('attachment://accepted-banner.png');
	modApplicationEmbed.setThumbnail('attachment://accepted-icon.png');

	const acceptButtonNew = new Discord.ButtonBuilder(acceptButtonOld.toJSON());
	const denyButtonNew = new Discord.ButtonBuilder(denyButtonOld.toJSON());

	acceptButtonNew.setDisabled();
	denyButtonNew.setDisabled();

	const row = new Discord.ActionRowBuilder();
	row.addComponents(acceptButtonNew, denyButtonNew);

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/accepted-icon.png',
			__dirname + '/../images/accepted-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Accepted mod application',
		ephemeral: true
	});
}

module.exports = {
	name: acceptButton.data.custom_id,
	button: acceptButton,
	handler: modApplicationAcceptHandler
};