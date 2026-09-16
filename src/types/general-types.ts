import type {
	BaseInteraction,
	ButtonBuilder,
	ButtonInteraction,
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
	ModalBuilder,
	ModalSubmitInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from 'discord.js';

export interface PollInfo {
	pollId: string;
	channelId: string;
	title: string;
	options: string[];
	votes: number[];
	expiryTime: number;
}

export type HandlerFunction<Interaction extends BaseInteraction> = (interaction: Interaction) => Promise<void>;

export interface ButtonHandler {
	name: string;
	button: ButtonBuilder;
	handler: HandlerFunction<ButtonInteraction>;
}

export interface CommandHandler {
	name: string;
	help?: string;
	handler: HandlerFunction<ChatInputCommandInteraction>;
	deploy: RESTPostAPIChatInputApplicationCommandsJSONBody;
	cooldown?: number; // ? unused, but chat-input-command-handler checks for it
}

export interface ContextMenuHandler {
	name: string;
	help?: string;
	handler: HandlerFunction<ContextMenuCommandInteraction>;
	deploy: RESTPostAPIContextMenuApplicationCommandsJSONBody;
}

export interface ModalHandler {
	name: string;
	modal: ModalBuilder;
	handler: HandlerFunction<ModalSubmitInteraction>;
	cooldown?: number;
}

export interface SelectMenuHandler {
	name: string;
	select_menu: StringSelectMenuBuilder;
	handler: HandlerFunction<StringSelectMenuInteraction>;
}

export type BaseHandler = ButtonHandler | CommandHandler | ContextMenuHandler | ModalHandler | SelectMenuHandler;
