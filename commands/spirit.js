"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spirit')
		.setDescription('Spirits tasting notes commands')
      .addSubcommandGroup( group =>
         group
         .setName('drink')
         .setDescription('Command group relating to the spirit itself.')
         .addSubcommand( subcommand =>
            subcommand
               .setName('add')
               .setDescription('Add spirit to database')
               .addStringOption( option =>
                  option
                  .setName('name')
                  .setDescription('Spirit Name')
                  .setRequired(true))
               .addStringOption( option =>
                  option
                  .setName('category')
                  .setDescription('Category of the spirit i.e. Whiskey, Gin, Scotch, Vodka.. etc.')
                  .setRequired(true))
               .addIntegerOption( option =>
                  option
                  .setName('age')
                  .setDescription('The number of years the spirit was aged (if applicable).')
                  .setRequired(false))
               .addStringOption( option =>
                  option
                  .setName('distillery')
                  .setDescription('The distillery where the spirit was distilled (if known).')
                  .setRequired(false))
               .addStringOption( option =>
                  option
                  .setName('region')
                  .setDescription('The region where the spirit was distilled (if available).')
                  .setRequired(false)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('edit')
               .setDescription('Edit a previously added spirit.')
               .addStringOption( option =>
                  option
                  .setName('name')
                  .setDescription('Spirit Name')
                  .setRequired(true))
               .addStringOption( option =>
                  option
                  .setName('category')
                  .setDescription('Category of the spirit i.e. Whiskey, Gin, Scotch, Vodka.. etc.')
                  .setRequired(true))
               .addIntegerOption( option =>
                  option
                  .setName('age')
                  .setDescription('The number of years the spirit was aged (if applicable).')
                  .setRequired(false))
               .addStringOption( option =>
                  option
                  .setName('distillery')
                  .setDescription('The distillery where the spirit was distilled (if known).')
                  .setRequired(false))
               .addStringOption( option =>
                  option
                  .setName('region')
                  .setDescription('The region where the spirit was distilled (if available).')
                  .setRequired(false)))
      )
   .addSubcommandGroup(group =>
      group
         .setName('note')
         .setDescription('Command group for tasting notes.')
         .addSubcommand( subcommand =>
            subcommand
               .setName('add')
               .setDescription('Add tasting note.'))
         .addSubcommand( subcommand =>
            subcommand
               .setName('edit')
               .setDescription('Edit existing tasting note.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the spirit you are editting the tasting note of.')
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('delete')
               .setDescription('Delete your tasting note.')
               .addStringOption(option =>
                  option
                     .setName('name')
                     .setDescription('Name of the spirit you are deleting your tasting note of.')
                     .setRequired(true))))
   .addSubcommandGroup( group =>
      group
         .setName('recipe'),
         .setDescription('Command group for recipes')
         .addSubcommand( subcommand =>
            subcommand
               .setName('add')
               .setDescription('Add a new recipe for a cocktail.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the cocktail.')
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('edit')
               .setDescription('Edit an existing recipe you submitted.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the cocktail recipe you want to edit.')
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('delete')
               .setDescription('Delete an existing cocktail recipe you submitted.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the cocktail recipe you want to delete.')
                     .setRequired(true))))
   .addSubcommandGroup( group =>
      group
         .setName('rating')
         .setDescription('Command group for rating spirits and recipes')
         .addSubcommand( subcommand =>
            subcommand
               .setName('add')
               .setDescription('Add rating for spirit or recipe')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the spirit or recipe to rate.')
                     .setRequired(true))
               .addIntegerOption( option =>
                  option
                     .setName('rating')
                     .setDescription('Rating given')
                     .addChoice('1', 1)
                     .addChoice('2', 2)
                     .addChoice('3', 3)
                     .addChoice('4', 4)
                     .addChoice('5', 5)
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('edit')
               .setDescription('Edit the rating of a previously rated recipe or spirit.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of the previously rated recipe or spirit.')
                     .setRequired(true))
               .addIntegerOption( option =>
                  option
                     .setName('rating')
                     .setDescription('Rating given')
                     .addChoice('1', 1)
                     .addChoice('2', 2)
                     .addChoice('3', 3)
                     .addChoice('4', 4)
                     .addChoice('5', 5)
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('delete')
               .setDescription('Delete a rating of your previously rated recipe or spirit.')
               .addStringOption(option =>
                  option
                     .setName('name')
                     .setDescription('Name of the previously rated recipe or spirit you want to delete.')
                     .setRequired(true)))),
   async execute(interaction, db) {
      //require db table files here
      if(interaction.options.getSubcommandGroup() === 'drink'){
         if(interaction.options.getSubcommand() === 'add'){

         }else if(interaction.options.getSubcommand() === 'edit'){

         }else if(interaction.options.getSubcommand() === 'delete'){

         }else{
            await interaction.reply({content:'Something went wrong with the spirit command.', ephemeral:true});
         }
      }else if(interaction.options.getSubcommandGroup() === 'note'){
         if(interaction.options.getSubcommand() === 'add'){

         }else if(interaction.options.getSubcommand() === 'edit'){

         }else if(interaction.options.getSubcommand() === 'delete'){

         }else{
            await interaction.reply({content:'Something went wrong with the tasting note command.', ephemeral:true});
         }
      }else if(interaction.options.getSubcommandGroup() === 'rating'){
         if(interaction.options.getSubcommand() === 'add'){

         }else if(interaction.options.getSubcommand() === 'edit'){

         }else if(interaction.options.getSubcommand() === 'delete'){

         }else{
            await interaction.reply({content:'Something went wrong with the rating command.', ephemeral:true});
         }
      }else if(interaction.options.getSubcommandGroup() === 'recipe'){
         if(interaction.options.getSubcommand() === 'add'){

         }else if(interaction.options.getSubcommand() === 'edit'){

         }else if(interaction.options.getSubcommand() === 'delete'){

         }else{
            await interaction.reply({content:'Something went wrong with the recipe command.', ephemeral:true});
         }
      }
   }
};
