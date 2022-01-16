const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu, Permissions, MessageEmbed } = require('discord.js');
const quiz = require('./quiz.json');

module.exports = {
	data: new SlashCommandBuilder()
      .setName('popQuiz')
      .setDescription('Pop quiz on a random topic. First to answer correctly wins.');
      .addStringOption(option =>
         option
            .setName('topic')
            .setDescription('Specify the topic for the pop quiz')
            .setRequired(false)))
   async execute(interaction){
         const quizObj = JSON.parse(quiz);
         const topic = interaction.options.getString('topic');
         const questions;
         const topicsarr = quizObj.topics;
         questions = getQuestions(topicsarr, topic);
         const randomQ = (Math.random() * questions.length)
         const question = questions[randomQ].question;
         const answers = questions[randomQ].answers;
         interaction.reply({content: `Question is ${question}`, ephemeral: false});

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
