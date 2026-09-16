import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import { getAllPollInfo, getPollInfo, closePoll as closePollDb, doesPollExist } from '@/database';
import { getRelativeTime } from '@/utils/cooldown';
import type { Client, Message, TextBasedChannel } from 'discord.js';

export enum PollStatus {
	Initial,
	Open,
	Closed
}

export async function getPollImage(pollId: string, status: PollStatus): Promise<Buffer<ArrayBufferLike>> {
	// Poll information
	const { title, options, votes, expiryTime } = await getPollInfo(pollId);
	const totalVotes = votes.reduce((partialSum, a) => partialSum + a, 0);
	const topVotedIndex = votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
	const expiryText = expiryTime === 0 ? '' : `Poll expires ${getRelativeTime(expiryTime)} - `;

	// Canvas information
	const initCanvasHeight = 145;
	const canvas = createCanvas(1200, initCanvasHeight + 100 * options.length);
	const ctx = canvas.getContext('2d');

	const topColor = 'rgb(95, 206, 121)';
	const primaryColor = 'rgb(149, 99, 249)';

	GlobalFonts.registerFromPath(
		`${__dirname}/../assets/fonts/Poppins-Bold.ttf`,
		'b'
	);

	GlobalFonts.registerFromPath(
		`${__dirname}/../assets/fonts/Poppins-Light.ttf`,
		'lite'
	);

	// Background
	ctx.strokeStyle = 'rgb(45, 50, 88)';
	ctx.fillStyle = 'rgb(45, 50, 88)';
	ctx.roundRect(0, 0, canvas.width, canvas.height, 25);
	ctx.stroke();
	ctx.fill();

	// Title
	let titleScale = 60;
	ctx.font = '60px b';
	ctx.textAlign = 'left';
	ctx.fillStyle = '#fff';

	do {
		titleScale -= 2;
		ctx.font = `${titleScale}px b`;
	} while (ctx.measureText(title).width > 1100);

	ctx.fillText(title, 30, 75, 1100);

	// Icon
	const image = await loadImage(`${__dirname}/../assets/images/poll-icon.png`);
	ctx.drawImage(image, 1109, 15);

	// Information Text
	ctx.font = '26px lite';
	ctx.textAlign = 'left';
	ctx.fillStyle = '#fff';
	ctx.fillText(`${status === PollStatus.Closed ? 'This poll has ended. - ' : expiryText}${totalVotes} votes`, 30, canvas.height - 20);

	for (let i = 0; i < options.length; i++) {
		const margin = 100 * i;
		const percentage = votes[i] === 0 ? 0 : Math.round((100 * votes[i]) / totalVotes);
		const isTopVoted = (i == topVotedIndex) && status === PollStatus.Closed;

		const rowColor = isTopVoted ? topColor : primaryColor;
		const pollRing = isTopVoted ? 'poll-ring-top' : 'poll-ring';

		if (status !== PollStatus.Initial) {
			// Option vote fill
			ctx.strokeStyle = 'rgba(149, 99, 249, 0.25)';
			ctx.fillStyle = 'rgba(149, 99, 249, 0.25)';
			ctx.beginPath();
			ctx.roundRect(37, 117 + margin, 11.25 * percentage, 66, 25);
			ctx.stroke();
			ctx.fill();
		}

		// Poll Ring
		const image = await loadImage(`${__dirname}/../assets/images/${pollRing}.png`);
		ctx.drawImage(image, 30, 110 + margin);

		// Option Text
		ctx.font = '30px lite';
		ctx.textAlign = 'left';
		ctx.fillStyle = rowColor;
		ctx.fillText(options[i], 55, 160 + margin);

		// Option vote percentage
		ctx.font = '22px b';
		ctx.textAlign = 'center';
		ctx.fillStyle = rowColor;
		ctx.fillText(`${percentage}%`, 1104, 117 + margin);
	}

	return canvas.toBuffer('image/png');
}

export async function updatePolls(client: Client): Promise<void> {
	const polls = await getAllPollInfo();
	for (const currentPoll of polls) {
		const pollStatus = currentPoll.expiryTime != 0 && currentPoll.expiryTime < Date.now() ? PollStatus.Closed : PollStatus.Open;

		const channel = client.channels.cache.get(currentPoll.channelId) as TextBasedChannel;
		let message: Message;

		try {
			message = await channel.messages.fetch(currentPoll.pollId);
		} catch {
			await closePollDb(currentPoll.pollId); // Assume the message was nuked or we don't have access anymore, force remove the poll.
			return;
		}

		if (pollStatus === PollStatus.Closed) {
			await closePoll(message);
			return;
		}

		const pollImage = await getPollImage(currentPoll.pollId, PollStatus.Open);
		const attachment = new AttachmentBuilder(pollImage, {
			name: 'image.png'
		});

		await message.edit({
			files: [attachment]
		});
	}
}

export async function closePoll(message: Message): Promise<void> {
	if (await doesPollExist(message.id) === false) {
		return;
	}

	const pollImage = await getPollImage(message.id, PollStatus.Closed);
	const attachment = new AttachmentBuilder(pollImage, {
		name: 'image.png'
	});

	await message.edit({
		files: [attachment],
		components: []
	});

	await closePollDb(message.id);
}
