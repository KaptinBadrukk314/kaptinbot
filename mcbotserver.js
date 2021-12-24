const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const wait = require('util').promisify(setTimeout);
const { Sequelize, DataTypes, Op } = require('sequelize');

const guildId = process.env.GUILD_ID;
const potterBook1 = [];

const db = new Sequelize({
   dialect: 'sqlite',
   storage: 'mcdata.sqlite'
});

const opts = {
   identity: {
      username: process.env.BOTNAME,
      password: process.env.PASS
   },
   channels:[
      process.env.CHANNELS
   ]
}

try {
  db.authenticate();
  console.log('Connection has been established successfully to database.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  return;
}

//create or alter db tables
const Topic = db.define('Topic', {
   id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   }
});

const Punishment = db.define('Punishment', {
   id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   description: {
      type: DataTypes.STRING,
      allowNull: false
   },
   voteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
   },
   activeFlg:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set(value){
        this.setDataValue('activeFlg', value);
      }
   }
});

const User = db.define('User', {
   id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
   },
   discordUsername:{
      type: DataTypes.STRING,
      allowNull: true
   },
   twitchUsername:{
      type: DataTypes.STRING,
      allowNull: true,
      set(value){
         this.setDataValue('twitchUsername', value);
      }
   }
});

const Vote = db.define('Vote', {
   id:{
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
   }
});

Vote.belongsTo(User);
Vote.belongsTo(Punishment);

//sync database
(async () =>{
   await db.sync();
})();

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
      if(interaction.commandName === 'punish'){
         await command.execute(interaction, Vote, User, Punishment);
      } else {
         await command.execute(interaction);
      }
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
      let check = await User.findOne({
         where: {
            twitchUsername:{
               [Op.eq]: userstate['username']
            }
         }
      });
      if(!check.twitchUsername){
        clientTwitch.say(channel, `${userstate['username']}, you must be signed up for the punishment wheel in order to spin.`);
        return;
      }
      let users = User.findAll();
      let punishments = Punishment.findAll();
      if(punishments.length == 0){
        clientTwitch.say(channel, `There are no punishments currently active. Please go to the discord and vote for the punishments you would like to be active.`);
        return;
      }
      let user = Math.floor(Math.random() * users.length);
      let punishment = Math.floor(Math.random() * punishments.length);
      clientTwitch.say(channel, `${user} has to endure ${punishment}`);
   }
   if (commandName.startsWith('!punish agree')){
      let temp = await User.findOne({
         where: {
            twitchUsername:{
               [Op.eq]: userstate['username']
            }
         }
      });
      if(temp.twitchUsername && temp.discordUsername){
        clientTwitch.say(channel, `${userstate['username']}, you are all set with the punishment wheel.`);
      }else{
        let msgArr = message.trim().split(" ");
        let discordId = msgArr[2];
        discordtemp = clientDiscord.Guilds.fetch().members.fetch(discordId);
        if(discordtemp){
           temp.discordUsername = discordtemp.name;
        }else{
           clientTwitch.say(channel, `${userstate['username']}, you must join the discord server first. https://discord.gg/qga8pANUEF then try the command again. It may take up to 1 hour before I see the discord update to show you as a member so please be patient.`);
        }
      }
      await temp.save();
   }
   if(commandName.startsWith('!punish withdraw')){
     let temp = await User.findOne({
        where: {
           twitchUsername:{
              [Op.eq]: userstate['username']
           }
        }
     });
     if(temp.twitchUsername){
        await temp.destroy();
        await temp.save();
        clientTwitch.say(channel, `${userstate['username']}, you have withdrawn from the punishment wheel.`);
     }else{
       clientTwitch.say(channel, `${userstate['username']}, you are not signed up for the punishment wheel.`);
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
