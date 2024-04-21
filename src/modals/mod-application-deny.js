const Discord = require('discord.js');
const database = require('../database');

const reason = new Discord.TextInputBuilder();
reason.setCustomId('reason');
reason.setLabel('Reason for denying moderator application.');
reason.setStyle(Discord.TextInputStyle.Paragraph);
reason.setPlaceholder('Enter a reason for denying...');
reason.setRequired(false);

const actionRow = new Discord.ActionRowBuilder();
actionRow.addComponents(reason);

const denyModApplicationModal = new Discord.ModalBuilder();
denyModApplicationModal.setCustomId('deny-moderator-application');
denyModApplicationModal.setTitle('Deny moderator application');
denyModApplicationModal.addComponents(actionRow);

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function denyModApplicationHandler(interaction) {
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

	modApplicationEmbed.setColor(0xF36F8A);
	modApplicationEmbed.setImage('attachment://denied-banner.png');
	modApplicationEmbed.setThumbnail('attachment://denied-icon.png');

	const acceptButtonNew = new Discord.ButtonBuilder(acceptButtonOld.toJSON());
	const denyButtonNew = new Discord.ButtonBuilder(denyButtonOld.toJSON());

	acceptButtonNew.setDisabled();
	denyButtonNew.setDisabled();

	const row = new Discord.ActionRowBuilder();
	row.addComponents(acceptButtonNew, denyButtonNew);

	const deniedApplicationEmbed = new Discord.EmbedBuilder();
	deniedApplicationEmbed.setColor(0xF36F8A);
	deniedApplicationEmbed.setTitle('Mod Application Denied');
	deniedApplicationEmbed.setDescription('Your moderator application has been denied.');
	deniedApplicationEmbed.setFields([{
		name: 'Reason',
		value: interaction.fields.getTextInputValue('reason') || 'No reason given.'
	}]);

	const applyingMember = await interaction.guild.members.fetch(modApplicationEmbed.data.description.match(/[0-9]+/)[0]);
	applyingMember.send({
		embeds: [deniedApplicationEmbed]
	}).catch(() => {});

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/denied-icon.png',
			__dirname + '/../images/denied-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Denied mod application',
		ephemeral: true
	});
}

module.exports = {
	name: denyModApplicationModal.data.custom_id,
	modal: denyModApplicationModal,
	handler: denyModApplicationHandler
};