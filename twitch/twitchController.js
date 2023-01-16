'use strict';

// const tmi = require('tmi.js');
import tmi from 'tmi.js';
// require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();

import pkg from 'sequelize';
const { Op } = pkg;

import pkg1 from '../db/models/user.cjs';
const { User } = pkg1;
import pkg2 from '../db/models/punishment.cjs';
const { Punishment } = pkg2;
// import { Vote } from '../db/models/vote.js';
import * as fs from 'fs';
import { clientDiscord } from '../discord/discordController.js';

const opts = {
	identity: {
		username: process.env.BOTNAME,
		password: process.env.PASS,
	},
	channels:[
		process.env.CHANNELS,
	],
};

let potterBook1 = null;

const clientTwitch = new tmi.client(opts);

clientTwitch.on('message', async (channel, userstate, message, self) => {
	if (self) { return;}

	const commandName = message.trim();

	// Date and GetMonth used to limit holiday functions to months of the holiday
	const d = new Date();
	const month = d.getMonth();

	if ((commandName.startsWith('!TrickOrTreat') || commandName.startsWith('!trickortreat') || commandName.startsWith('!tot')) && month == 9) {
		const arr = message.trim().split(' ');
		const user = arr.filter(trickHelper);
		const num = Math.floor(Math.random() * 2);
		console.log(user);
		console.log(arr);
		console.log(num);
		if (num == 1) {
			// treat
			clientTwitch.say(channel, `${userstate['display-name']} gave a treat to ${user}`);
		}
		else {
			clientTwitch.say(channel, `${userstate['display-name']} tricked ${user}`);
		}
	}
	if (commandName === '!NoContextHP' || commandName === '!nocontexthp' || commandName === '!nchp' || commandName === '!NCHP') {
		clientTwitch.say(channel, `${userstate['display-name']}'s Harry Potter Quote: ${generateHPQuote()}`);
	}
	if (commandName.startsWith('!spin') || commandName.startsWith('!punish')) {
		const check = await User.findOne({
			where: {
				twitchUsername:{
					[Op.eq]: userstate['display-name'],
				},
			},
		});
		console.log(check);
		console.log(userstate);
		if (!check || !check.twitchUsername) {
			clientTwitch.say(channel, `${userstate['display-name']}, you must be signed up for the punishment wheel in order to spin.`);
			return;
		}
		const users = await User.findAll();
		const punishments = await Punishment.findAll();
		if (punishments.length == 0) {
			clientTwitch.say(channel, 'There are no punishments currently active. Please go to the discord and vote for the punishments you would like to be active.');
			return;
		}

		const user = users[Math.floor(Math.random() * users.length)].twitchUsername;
		const punishment = punishments[Math.floor(Math.random() * punishments.length)].description;
		console.log(users);
		console.log(punishments);
		console.log(user);
		console.log(punishment);
		clientTwitch.say(channel, `${user} has to endure ${punishment}`);
	}
	if (commandName.startsWith('!punish agree')) {
		const temp = User.findOne({
			where: {
				twitchUsername:{
					[Op.eq]: userstate['display-name'],
				},
			},
		});
		if (temp.twitchUsername && temp.discordUsername) {
			clientTwitch.say(channel, `${userstate['display-name']}, you are all set with the punishment wheel.`);
		}
		else {
			const msgArr = message.trim().split(' ');
			const discordId = msgArr[2];
			const discordtemp = clientDiscord.Guilds.fetch().members.fetch(discordId);
			if (discordtemp) {
				temp.discordUsername = discordtemp.name;
			}
			else {
				clientTwitch.say(channel, `${userstate['display-name']}, you must join the discord server first. https://discord.gg/qga8pANUEF then try the command again. It may take up to 1 hour before I see the discord update to show you as a member so please be patient.`);
			}
		}
		await temp.save();
	}
	if (commandName.startsWith('!punish withdraw')) {
		const temp = await User.findOne({
			where: {
				twitchUsername:{
					[Op.eq]: userstate['display-name'],
				},
			},
		});
		if (temp.twitchUsername) {
			await temp.destroy();
			await temp.save();
			clientTwitch.say(channel, `${userstate['display-name']}, you have withdrawn from the punishment wheel.`);
		}
		else {
			clientTwitch.say(channel, `${userstate['display-name']}, you are not signed up for the punishment wheel.`);
		}
	}
});

// Helper Functions
function trickHelper(value) {
	return value.startsWith('@');
}

function generateHPQuote() {
	const quoteNum = Math.floor(Math.random() * potterBook1.length);
	return potterBook1[quoteNum];
}

function precompileHP() {
	try {
		// https://github.com/amephraim/nlp/blob/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt
		potterBook1 = fs.readFileSync('Harry Potter Book 1.txt', 'utf8').trim().split('\r\n').filter((value) => {
			return value != '';
		});
	}
	catch (err) {
		console.error(err);
		return;
	}
}

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

clientTwitch.on('connected', onConnectedHandler);

clientTwitch.connect();

export { clientTwitch, precompileHP };
