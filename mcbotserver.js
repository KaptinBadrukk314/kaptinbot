"use strict";

const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const wait = require('util').promisify(setTimeout);
const { Sequelize, Op } = require('sequelize');
//const perm = require('./permission.js');

const guildId = process.env.GUILD_ID;
const potterBook1 = [];

const db = new Sequelize({
   dialect: 'sqlite',
   storage: 'mcdata.sqlite'
});

const User = require('./models/user')(db);
const Punishment = require('./models/punishment')(db);
const Vote = require('./models/vote')(db);

try {
  db.authenticate();
  console.log('Connection has been established successfully to database.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  return;
}

//sync database
(async () =>{
   await db.sync();
})();

const opts = {
   identity: {
      username: process.env.BOTNAME,
      password: process.env.PASS
   },
   channels:[
      process.env.CHANNELS
   ]
}

precompileHP();

const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });

const clientTwitch = new tmi.client(opts);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

clientDiscord.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//load commands for discord
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	clientDiscord.commands.set(command.data.name, command);
}

//load events for discord
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
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
    await command.execute(interaction, db);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

clientTwitch.on('message', async (channel, userstate, message, self) =>{
   if (self) { return;}

   const commandName = message.trim();

   //Date and GetMonth used to limit holiday functions to months of the holiday
   const d = new Date();
   let month = d.getMonth();

   if ((commandName.startsWith('!TrickOrTreat') || commandName.startsWith('!trickortreat') || commandName.startsWith('!tot')) && month == 9){
      let arr = message.trim().split(" ");
      let user = arr.filter(trickHelper);
      let num = Math.floor(Math.random() * 2);
      console.log(user);
      console.log(arr);
      console.log(num);
      if (num == 1){//treat
         clientTwitch.say(channel, `${userstate['username']} gave a treat to ${user}`);
      }else{
         clientTwitch.say(channel, `${userstate['username']} tricked ${user}`);
      }
   }
   if(commandName === '!NoContextHP' || commandName === '!nocontexthp' || commandName === '!nchp' || commandName === '!NCHP'){
     clientTwitch.say(channel, `${userstate['username']}\'s Harry Potter Quote: ${generateHPQuote()}`);
   }
   if (commandName.startsWith('!spin') || commandName.startsWith('!punish')){
      //// TODO: Update to use new db
      //clientTwitch.say(channel, `${user} has to endure ${punishment}`);
   }
   if (commandName.startsWith('!punish agree')){
      var temp = User.findOne({
         where: {
            twitchUsername:{
               [Op.eq]: userstate['username']
            }
         }
      });
      //// TODO: no whisper allowed.
      // FIXME: redirect to discord for signup to use punishment
      switch(userstate["message-type"]) {
           case "chat":
               if(temp.twitchUsername && temp.discordUsername){
                  clientTwitch.say(channel, `${userstate['username']}, you are all set with the punishment wheel.`);
               }else{
                  var newUser = {};
                  if(!temp.twitchUsername){
                     newUser = User.build({
                        twitchUsername: userstate['username']
                     })
                  }
                  await newUser.save();
                  clientTwitch.say(channel, `${userstate['username']} please reply to the whisper as instructed.`);
                  clientTwitch.whisper(userstate['username'], `${userstate['username']} please respond to this whisper with the command "!punish agree <discorduserid>" where <discorduserid> is replaced with your discord user id.`);
               }
               break;
           case "whisper":
               if(temp.twitchUsername && temp.discordUsername){
                  clientTwitch.whisper(userstate['username'], `${userstate['username']}, you are all set with the punishment wheel.`);
               }else{
                  var whisperMsgArr = message.trim().split(" ");
                  var discordId = whisperMsgArr[2];
                  discordtemp = clientDiscord.Guilds.fetch().members.fetch(discordId);
                  if(discordtemp){
                     temp.discordUsername = discordtemp.name;
                  }else{
                     clientTwitch.whisper(userstate['username'], `${userstate['username']}, you must join the discord server first. https://discord.gg/qga8pANUEF then try the command again. It may take up to 1 hour before I see the discord update to show you as a member so please be patient.`);
                  }
               }
               await temp.save();
               break;
           default:
               clientTwitch.say(channel, "I don't know what happened to be honest...")
               break;
         }
   }
});

//Helper Functions
function trickHelper(value, index, array){
   return value.startsWith('@');
}

function generateHPQuote(){
   let quoteNum = Math.floor(Math.random() * potterBook1.length);
   return potterBook1[quoteNum];
}

function precompileHP(){
  try{
    //https://github.com/amephraim/nlp/blob/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt
    potterBook1 = fs.readFileSync("Harry Potter Book 1.txt", 'utf8').trim().split('\r\n').filter((value, index, array)=>{
       return value != '';
    });
  }
  catch(err){
    console.error(err);
    return;
  }
}

clientTwitch.on('connected', onConnectedHandler);

clientTwitch.connect();
clientDiscord.login(token);

function onConnectedHandler(addr, port){
   console.log(`* Connected to ${addr}:${port}`);
}

async function failDbConnect(db){
   try {
     await db.authenticate();
     console.log('Connection has been established successfully to database.');
     return false;
   } catch (error) {
     console.error('Unable to connect to the database:', error);
     return true;
   }
}
