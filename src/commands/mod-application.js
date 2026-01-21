const Discord = require('discord.js');
const database = require('../database');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { modal: modApplicationModal } = require('../modals/mod-application');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function modApplicationHandler(interaction) {
	modApplicationModal.setCustomId('mod-application-' + interaction.options.get('role').value);

	if (interaction.options.get('18-or-older').value == 'no') {
		await interaction.reply({
			content: 'We are not accepting applications from individuals under the age of 18.',
			ephemeral: true,
			allowedMentions: {
				parse: [], // dont allow tagging anything
			},
		});

		const modType = interaction.options.get('role').value;

		let selectedDBItem = '';
		switch (modType) {
			case 'discord':
				selectedDBItem = 'mod_applications_channel_id';
				break;
			case 'vc':
				selectedDBItem = 'vc_mod_apps_channel_id';
				break;
			case 'forum':
				selectedDBItem = 'forum_mod_apps_channel_id';
				break;
			case 'network':
				selectedDBItem = 'network_mod_apps_channel_id';
				break;
			case 'juxt':
				selectedDBItem = 'juxt_mod_apps_channel_id';
				break;
		}

		const applyingMember = await interaction.member.fetch();
		const guild = await interaction.guild.fetch();
		const channelId = await database.getGuildSetting(interaction.guildId, selectedDBItem);
		const channel = channelId && await guild.channels.fetch(channelId);

		const modApplicationEmbed = new Discord.EmbedBuilder();

		modApplicationEmbed.setColor(0xF36F8A);

		switch (modType) {
			case 'discord':
				modApplicationEmbed.setTitle('Discord Mod Application');
				break;
			case 'vc':
				modApplicationEmbed.setTitle('VC Mod Application');
				break;
			case 'forum':
				modApplicationEmbed.setTitle('Forum Mod Application');
				break;
			case 'network':
				modApplicationEmbed.setTitle('Network Mod Application');
				break;
			case 'juxt':
				modApplicationEmbed.setTitle('Juxt Mod Application');
				break;
		}
		modApplicationEmbed.setDescription(`<@${applyingMember.user.id}> has attempted a ${modType} moderator application. This user specified they are under the age of 18.`);
		modApplicationEmbed.setImage('attachment://denied-banner.png');
		modApplicationEmbed.setThumbnail('attachment://denied-icon.png');
		modApplicationEmbed.setAuthor({
			name: applyingMember.user.tag,
			iconURL: applyingMember.user.avatarURL()
		});
		modApplicationEmbed.setFooter({
			text: 'Pretendo Network',
			iconURL: guild.iconURL()
		});
		modApplicationEmbed.setTimestamp(Date.now());

		await channel.send({
			embeds: [modApplicationEmbed],
			components: [],
			files: [
				__dirname + '/../images/denied-icon.png',
				__dirname + '/../images/denied-banner.png',
			]
		});

		return;
	}

	interaction.showModal(modApplicationModal, {
		client: interaction.client,
		interaction: interaction
	});
}

const command = new SlashCommandBuilder()
	.setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages)
	.setName('mod-application')
	.setDescription('Apply for a position as a moderator.')
	.addStringOption(option =>
		option.setName('role')
			.setDescription('Moderator type to apply to.')
			.setRequired(true)
			.addChoices(
				{ name: 'Discord Moderator', value: 'discord' },
				//{ name: 'Discord VC Moderator', value: 'vc' },
				{ name: 'Forum Moderator', value: 'forum' },
				//{ name: 'Network Moderator', value: 'network' },
				{ name: 'Juxtaposition Moderator', value: 'juxt' }
			))
	.addStringOption(option =>
		option.setName('18-or-older')
			.setDescription('Are you 18 years old or older?')
			.setRequired(true)
			.addChoices(
				{ name: 'Yes', value: 'yes' },
				{ name: 'No', value: 'no' }
			));

module.exports = {
	name: command.name,
	help: 'Displays a popup modal to apply for a moderator position.\n```\nUsage: /mod-application role 18-or-older\n```',
	handler: modApplicationHandler,
	deploy: command.toJSON()
};
