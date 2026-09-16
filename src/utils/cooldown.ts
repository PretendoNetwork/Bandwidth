import { EmbedBuilder } from 'discord.js';
import { initMemberCooldown, getCommandCooldown, updateCommandCooldown } from '@/database';
import type { BaseHandler } from '@/types/general-types';

export async function isInteractionOnCooldown(interactionHandler: BaseHandler, memberId: string): Promise<false | EmbedBuilder> {
	if (!('cooldown' in interactionHandler) || !interactionHandler.cooldown) {
		return false;
	}

	// Initialize our cooldown if not already and grab the cooldown
	await initMemberCooldown(memberId, interactionHandler.name);
	const cooldown = await getCommandCooldown(memberId, interactionHandler.name);

	// Check if we are still on cooldown or if there has never been a cooldown for this command yet
	if (!cooldown || Date.now() > cooldown) {
		return false;
	}

	const cooldownEmbed = new EmbedBuilder();
	const relativeTime = getRelativeTime(cooldown);

	cooldownEmbed.setColor(0xF36F8A);
	cooldownEmbed.setTitle('Cooldown!');
	cooldownEmbed.setDescription('Sorry, that action is on cooldown right now.');
	cooldownEmbed.setFooter({ text: `Expires ${relativeTime}` });

	// Return an embed back rather than false that will be used to show we're on cooldown
	return cooldownEmbed;
}

export async function beginCooldown(interactionHandler: BaseHandler, memberId: string): Promise<void> {
	if (!('cooldown' in interactionHandler) || !interactionHandler.cooldown) {
		return;
	}

	const endTime = new Date(Date.now() + interactionHandler.cooldown).getTime();

	await updateCommandCooldown(memberId, interactionHandler.name, endTime);
}

export function getRelativeTime(timestamp: number): string {
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	const elapsed = Number(timestamp.toString().padEnd(13, '0')) - Date.now();

	if (elapsed < msPerMinute) {
		return `in ${Math.round(elapsed / 1000)} second(s)`;
	} else if (elapsed < msPerHour) {
		return `in ${Math.round(elapsed / msPerMinute)} minute(s)`;
	} else if (elapsed < msPerDay) {
		return `in ${Math.round(elapsed / msPerHour)} hour(s)`;
	} else if (elapsed < msPerMonth) {
		return `in ${Math.round(elapsed / msPerDay)} day(s)`;
	} else if (elapsed < msPerYear) {
		return `in ${Math.round(elapsed / msPerMonth)} month(s)`;
	} else {
		return `in ${Math.round(elapsed / msPerYear)} year(s)`;
	}
}
