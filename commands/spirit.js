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
      const Spirit = require('../models/spirit')(db);
      const SpiritColor = require('../models/spiritColor')(db);
      const SpiritSmell = require('../models/spiritSmell')(db);
      const SpiritTaste = require('../models/spiritTaste')(db);
      const SpiritUser = require('../models/spiritUser')(db);
      const SpiritTool = require('../models/spiritTool')(db);
      const SpiritRating = require('../models/spiritRating')(db);
      const SpiritRecipe = require('../models/spiritRecipe')(db);
      const SpiritNotes = require('../models/spiritNotes')(db);

      if(interaction.options.getSubcommandGroup() === 'drink'){
         if(interaction.options.getSubcommand() === 'add'){
            let user = await SpiritUser.findOne({
               where: {
                  discordUsername:{
                     [Op.eq]: interaction.user.username
                  }
               }
            });
            if(!user){
               user = await SpiritUser.build({discordUsername: interaction.user.username});
               await user.save();
            }
            let newSpirit = await Spirit.build({name: interaction.options.getString('name'), age: interaction.options.getInteger('age'), category: interaction.options.getString('category'), distillery: interaction.options.getString('distillery'), region: interaction.options.getString('region') });
            await newSpirit.save();
            await interation.replay({content:`Successfully added the spirit ${interaction.options.getString('name')} to the database.`});
         }else if(interaction.options.getSubcommand() === 'edit'){
            let user = await SpiritUser.findOne({
               where: {
                  discordUsername:{
                     [Op.eq]: interaction.user.username
                  }
               }
            });
            if(!user){
               user = await SpiritUser.build({discordUsername: interaction.user.username});
               await user.save();
               await interaction.reply({content:'You have not added any spirits to edit.', ephemeral: true});
            }
         }else if(interaction.options.getSubcommand() === 'delete'){
            // TODO: check cascade on delete or possible fallout for removing spirit that a note or recipe relied on
            let user = await SpiritUser.findOne({
               where: {
                  discordUsername:{
                     [Op.eq]: interaction.user.username
                  }
               }
            });
            if(!user){
               user = await SpiritUser.build({discordUsername: interaction.user.username});
               await user.save();
               await interaction.reply({content:'You have not added any spirits to delete.', ephemeral: true});
            }
            let name = interaction.options.getString('name');
            let toBeDeleted = await Spirit.findOne({
               where:{
                  discordUsername:{
                     [Op.eq]: interaction.user.username
                  },
                  name:{
                     [Op.eq]: name
                  }
               }
            });
            await toBeDeleted.destroy();
            await toBeDeleted.save();
            await interaction.reply({content:`Successfully deleted the spirit ${name} that you created.`, ephemeral: true});
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
