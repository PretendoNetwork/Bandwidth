import type { ButtonHandler, CommandHandler, ContextMenuHandler, ModalHandler, SelectMenuHandler } from '@/types/general-types';
import type { Collection } from 'discord.js';
import type AIMessageProcessor from '@/nlp/message-processor';

declare module 'discord.js' {
	export interface Client {
		aiMessageProcessor: AIMessageProcessor;
		buttons: Collection<string, ButtonHandler>;
		commands: Collection<string, CommandHandler>;
		contextMenus: Collection<string, ContextMenuHandler>;
		modals: Collection<string, ModalHandler>;
		selectMenus: Collection<string, SelectMenuHandler>;
	}
}
