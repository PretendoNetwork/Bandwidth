import { EmbedBuilder } from 'discord.js';
import { getGuildSetting } from '@/database';
import type { GuildMember } from 'discord.js';

export default async function guildMemberAddHandler(member: GuildMember): Promise<void> {
	const guild = member.guild;

	const readmeChannelId = await getGuildSetting(member.guild.id, 'readme_channel_id');
	const rulesChannelId = await getGuildSetting(member.guild.id, 'rules_channel_id');
	const readmeChannel = readmeChannelId && await guild.channels.fetch(readmeChannelId);
	const rulesChannel = rulesChannelId && await guild.channels.fetch(rulesChannelId);

	const welcomeEmbed = new EmbedBuilder();

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

	try {
		await member.send({
			embeds: [welcomeEmbed]
		});
	} catch {
		// caught because user could have dm's disabled
	}

	if (await getGuildSetting(member.guild.id, 'unverified_role_id') !== undefined) {
		const role = guild.roles.cache.get(await getGuildSetting(member.guild.id, 'unverified_role_id'));
		await member.roles.add(role!);
	}
}
