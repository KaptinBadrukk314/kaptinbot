"use strict";

import { SlashCommandBuilder } from '@discordjs/builders';
import pkg from 'sequelize'
const { Sequelize, DataTypes, Op } = pkg;
import { MessageActionRow, MessageSelectMenu, Permissions, MessageEmbed } from 'discord.js';
//const quiz = require('./quiz.json');

export const popQuizData = new SlashCommandBuilder()
   .setName('popquiz')
   .setDescription('Pop quiz on a random topic')
   .addSubcommand(subcommand => subcommand
      .setName('start')
      .setDescription('Starts a pop quiz queue')
      .addStringOption(option => option
         .setName('topic')
         .setDescription('Specify the topic for the pop quiz')
         .setRequired(false)));
export async function popQuizExecute(interaction, db) {
   if (interaction.options.getSubcommand() === 'start') {
      //const quizObj = JSON.parse(quiz);
      const topic = interaction.options.getString('topic');
      const questions = {};
      if (topic) {
         //get questions from specified topic
         quizObj.topics.get(topic);
      } else {
         //get questions from random topic
      }
   }
}
