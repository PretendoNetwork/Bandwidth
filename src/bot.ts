import { Client, GatewayIntentBits, Partials, Collection, Events } from 'discord.js';
import AIMessageProcessor from '@/nlp/message-processor';
import readyHandler from '@/events/ready';
import guildMemberAddHandler from '@/events/guildMemberAdd';
import interactionCreateHandler from '@/events/interactionCreate';
import messageCreateHandler from '@/events/messageCreate';
import threadCreateHandler from '@/events/threadCreate';
import config from '@/../config.json';
import type { ButtonHandler, CommandHandler, ContextMenuHandler, ModalHandler, SelectMenuHandler } from '@/types/general-types';

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});

client.aiMessageProcessor = new AIMessageProcessor();

client.buttons = new Collection<string, ButtonHandler>();
client.commands = new Collection<string, CommandHandler>();
client.contextMenus = new Collection<string, ContextMenuHandler>();
client.modals = new Collection<string, ModalHandler>();
client.selectMenus = new Collection<string, SelectMenuHandler>();

client.on(Events.ClientReady, readyHandler);
client.on(Events.GuildMemberAdd, guildMemberAddHandler);
client.on(Events.InteractionCreate, interactionCreateHandler);
client.on(Events.MessageCreate, messageCreateHandler);
client.on(Events.ThreadCreate, threadCreateHandler);

client.login(config.bot_token).catch((error) => {
	console.error('Client login failed: ' + error);
});
