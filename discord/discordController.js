"use strict";

import fs from 'fs'
//require('dotenv').config();
import * as dotenv from 'dotenv'
dotenv.config();

//const { Client, Collection, Intents } = require('discord.js');
import { Client, Collection, Intents } from 'discord.js'

//imports for 
import { modData, modExecute } from './commands/mod.js';
import { popQuizData, popQuizExecute } from './commands/popQuiz.js';
import { punishData, punishExecute } from './commands/punish.js';

const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
const guildId = process.env.GUILD_ID;

const eventFiles = fs.readdirSync('./discord/events').filter(file => file.endsWith('.js'));

clientDiscord.commands = new Collection();

//load commands for discord
//manually added for each command after ES6 refactor
clientDiscord.commands.set(modData.name, modExecute);
clientDiscord.commands.set(popQuizData.name, popQuizExecute);
clientDiscord.commands.set(punishData.name, punishExecute);


//load events for discord
for (const file of eventFiles) {
	const event = require(`./discord/events/${file}`);
	if (event.once) {
		clientDiscord.once(event.name, (...args) => event.execute(...args));
	} else {
		clientDiscord.on(event.name, (...args) => event.execute(...args));
	}
}

clientDiscord.on('interactionCreate', async interaction =>{
   if (!interaction.isCommand()) return;

	const command = clientDiscord.commands.get(interaction.commandName);

	if (!command) return;
	
	try {
    	await clientDiscord.commands.get(interaction.commandName)(interaction, db);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

clientDiscord.login(process.env.TOKEN);

export { clientDiscord };
