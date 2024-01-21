'use strict';

// import * as fs from 'fs';
// require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();

// const { Client, Collection, Intents } = require('discord.js');
import { Client, Collection, Intents } from 'discord.js';

// imports for commands
import { modData } from './commands/mod.js';
import { popQuizData } from './commands/popQuiz.js';
import { punishData } from './commands/punish.js';

// imports for events
import { readyData } from './events/ready.js';

const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
// const guildId = process.env.GUILD_ID;

// const eventFiles = fs.readdirSync('./discord/events').filter(file => file.endsWith('.js'));

clientDiscord.commands = new Collection();

// load commands for discord
// manually added for each command after ES6 refactor
clientDiscord.commands.set(modData.name, modData);
clientDiscord.commands.set(popQuizData.name, popQuizData);
clientDiscord.commands.set(punishData.name, punishData);


// load events for discord
// manually added for each command after ES6 refactor
// for (const file of eventFiles) {
// 	const event = require(`./discord/events/${file}`);
// 	if (event.once) {
// 		clientDiscord.once(event.name, (...args) => event.execute(...args));
// 	}
// 	else {
// 		clientDiscord.on(event.name, (...args) => event.execute(...args));
// 	}
// }
// above replaced with manual event list
clientDiscord.once(readyData.name, (...args) => readyData.execute(...args));

clientDiscord.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = clientDiscord.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

clientDiscord.login(process.env.TOKEN);

export { clientDiscord };
