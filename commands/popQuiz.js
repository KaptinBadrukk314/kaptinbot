const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu, Permissions, MessageEmbed } = require('discord.js');
const quiz = require('./quiz.json');

module.exports = {
	data: new SlashCommandBuilder()
      .setName('popQuiz')
      .setDescription('Pop quiz on a random topic. First to answer correctly wins.')
      .addIntegerOption(option=>
         option
            .setName('time')
            .setDescription('Specify the time in milliseconds to answer the question. Default: 30000 (1 minute)')
            .setRequired(false))
      .addStringOption(option =>
         option
            .setName('topic')
            .setDescription('Specify the topic for the pop quiz')
            .setRequired(false))
   async execute(interaction){
         const quizObj = JSON.parse(quiz);
         const topic = interaction.options.getString('topic');
         const time = interaction.options.getInteger('time')
         const topicsarr = quizObj.topics;
         const questions = getQuestions(topicsarr, topic);
         const item = questions[(Math.random() * questions.length)];
         const filter = response => {
         	return answers.some(item.answer => answer.toLowerCase() === response.content.toLowerCase());
         };

         interaction.reply(item.question, { fetchReply: true })
         	.then(() => {
         		interaction.channel.awaitMessages({ filter, max: 1, time: time, errors: ['time'] })
         			.then(collected => {
         				interaction.followUp(`${collected.first().author} got the correct answer!`);
         			})
         			.catch(collected => {
         				interaction.followUp('Looks like nobody got the answer this time.');
         			});
         	});

   }
};

function getQuestions(topicsarr, topic){
   if(topic){
      for (const element in topicsarr){
         if(element.name === topic){
            return element.questions;
         }
      }
   }else{
      return topicsarr[(Math.random() * topicsarr.length)].questions;
   }
}
