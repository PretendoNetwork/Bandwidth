const Discord = require('discord.js');
const database = require('../database');

/**
 *
 * @param {Discord.GuildMember} member
 */
async function guildMemberAddHandler(member) {
	const guild = member.guild;

	const readmeChannelId = await database.getGuildSetting(member.guild.id, 'readme_channel_id');
	const rulesChannelId = await database.getGuildSetting(member.guild.id, 'rules_channel_id');
	const readmeChannel = readmeChannelId && await guild.channels.fetch(readmeChannelId);
	const rulesChannel = rulesChannelId && await guild.channels.fetch(rulesChannelId);

	const welcomeEmbed = new Discord.EmbedBuilder();

	welcomeEmbed.setColor(0x1B1F3B);
	welcomeEmbed.setTitle('Welcome to Pretendo Network :tada:');
	welcomeEmbed.setURL('https://pretendo.network');

	let rulesAndReadmeText = 'to rules and readme channels';

	if (readmeChannel && rulesChannel) {
		rulesAndReadmeText = `to the <#${readmeChannel.id}> and <#${rulesChannel.id}> channels`;
	}

	welcomeEmbed.setDescription(`**Thank you for joining the Pretendo Network Discord server! Be sure to refer ${rulesAndReadmeText} for detailed information about the server**\n\n_**Links**_:\nWebsite - https://pretendo.network\nGitHub - https://github.com/PretendoNetwork\nPatreon - https://patreon.com/PretendoNetwork\nTwitter -  https://twitter.com/PretendoNetwork\nTwitch - https://twitch.tv/PretendoNetwork\nYouTube - https://youtube.com/c/PretendoNetwork`);
	welcomeEmbed.setThumbnail('https://i.imgur.com/8clyKqx.png');
	welcomeEmbed.setImage('https://i.imgur.com/CF7qgW1.png');

	// caught because user could have dm's disabled
	try {
		await member.send({
			embeds: [welcomeEmbed],
		});
	} catch {}

	if (await database.getGuildSetting(member.guild.id, 'unverified_role_id') !== undefined) {
		const role = guild.roles.cache.get(await database.getGuildSetting(member.guild.id, 'unverified_role_id'));
		member.roles.add(role);
	}

}

module.exports = guildMemberAddHandler;