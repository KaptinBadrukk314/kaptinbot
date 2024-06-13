'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, Intents } from 'discord.js';

// imports for commands
import { modData } from './commands/mod.js';
import { popQuizData } from './commands/popQuiz.js';
import { punishData } from './commands/punish.js';

// imports for events
import { readyData } from './events/ready.js';

const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
clientDiscord.commands = new Collection();

// load commands for discord
// manually added for each command after ES6 refactor
clientDiscord.commands.set(modData.name, modData);
clientDiscord.commands.set(popQuizData.name, popQuizData);
clientDiscord.commands.set(punishData.name, punishData);

// load events for discord
// manually added for each command after ES6 refactor
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
