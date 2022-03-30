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
         .addSubcommand( subcommand =>
            subcommand
               .setName('view')
               .setDescription('View the spirit(s)')
               .addStringOption( option =>
                  option
                     .setName('user')
                     .setDescription('User of that added the spirits you want to view')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('spiritname')
                     .setDescription('Name of the spirit you want to view.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('category')
                     .setDescription('Category of spirit(s) you want to view.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('distillery')
                     .setDescription('Name of the distillery of the spirit(s) you want to view.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('region')
                     .setDescription('Name of the region the spirit(s) you want to view.')
                     .setRequired(false))
               .addIntegerOption( option =>
                  option
                     .setName('rating')
                     .setDescription('Rating of the spirit(s) you want to view.')
                     .addChoice('1', 1)
                     .addChoice('2', 2)
                     .addChoice('3', 3)
                     .addChoice('4', 4)
                     .addChoice('5', 5)
                     .setRequired(false)))
      .addSubcommand( subcommand =>
         subcommand
            .setName('help')
            .setDescription('Help command for drink command group')))
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
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('view')
               .setDescription('View tasting notes. Use spirit note help for instructions on how to use the command.')
               .addStringOption( option =>
                  option
                     .setName('user')
                     .setDescription('User of the tasting note(s) you want to view')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('spiritname')
                     .setDescription('Name of the spirit you want to view the tasting notes for.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('category')
                     .setDescription('Category of spirit(s) you want to view tasting notes of.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('distillery')
                     .setDescription('Name of the distillery of the spirit(s) you want to view tasting notes of.')
                     .setRequired(false))
               .addStringOption( option =>
                  option
                     .setName('region')
                     .setDescription('Name of the region the spirit(s) you want to view the tasting notes of.')
                     .setRequired(false))
               .addIntegerOption( option =>
                  option
                     .setName('rating')
                     .setDescription('Rating of the spirit(s) you want to view the tasting notes of.')
                     .addChoice('1', 1)
                     .addChoice('2', 2)
                     .addChoice('3', 3)
                     .addChoice('4', 4)
                     .addChoice('5', 5)
                     .setRequired(false)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('help')
               .setDescription('Instructions on how to use the note commands')))
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
                     .setRequired(true)))
         .addSubcommand( subcommand =>
            subcommand
               .setName('view')
               .setDescription('View recipes in the database. Leave name parameter empty to search all.')
               .addStringOption( option =>
                  option
                     .setName('name')
                     .setDescription('Name of recipe to search for.')
                     .setRequired(false))))
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
            }else{
               //edit spirit
							 //accepts name and category and more if needed to differ
							 //search db for particular spirit
							 //use buttons to select what to update
							 let where = {{name:{[Op.eq] interaction.options.getString('name')}, {category:{[Op.eq]interaction.options.getString('category')}};
							 if(interaction.options.getInteger('age')){
								 where.age = {[Op.eq] interaction.options.getInteger('age')};
							 }
							 if(interaction.options.getString('distillery')){
								 where.distillery = {[Op.eq] interaction.options.getString('distillery')};
							 }
							 if(interaction.options.getString('region')){
								 where.region = {[Op.eq] interaction.options.getString('region')};
							 }
							 let spiritEdit = Spirit.findAll(where);
							 switch(spiritEdit.length){
								 default://more than one
									 //drop down to select which one
									 //set spiritEdit as selected
									 //no break to fall into case 1
									 let spiritArray = [];
									 spiritEdit.forEach((item)=>{
										 const temp = {
											 label: item.name,
											 description: `${item.category}, ${item.age}, ${item.distillery}, ${item.region}`,
											 value: item.id
										 };
										 spiritArray.push(temp);
									 });
									 const row = new MessageActionRow()
									 		.addComponents(
												new MessageSelectMenu()
													.setCustomId('selectSpirit')
													.setPlaceholder('Select the spirit to edit')
													.setMinValues(1)
													.setMaxValues(1)
													.addOptions(spiritArray);
											);
										await interaction.reply({content: 'Select the spirit to edit', ephemeral: true, components:[row]});
										const collector = interaction.createMessageComponentCollector({componentType: 'SELECT_MENU', time: 60000, errors: ['time']});
										collector.on('collect', i => {
											if(i.user.id === interaction.user.id){
												//process spirit collected
											}else{

											}
										});
								 case 1://exactly one
								 	 //use buttons to decide which to update
									 //capture response afterwards
									 //update entry to reflect edit
									 break;
								 case 0://none returned
									 await interaction.reply({content:'No Spirit found.', ephemeral:true});
									 break;
							 }
            }
         }else if(interaction.options.getSubcommand() === 'view'){

         }else if(interaction.options.getSubcommand() === 'help'){

         }else{
            await interaction.reply({content:'Something went wrong with the spirit drink command.', ephemeral:true});
         }
      }else if(interaction.options.getSubcommandGroup() === 'note'){
         if(interaction.options.getSubcommand() === 'add'){

         }else if(interaction.options.getSubcommand() === 'edit'){

         }else if(interaction.options.getSubcommand() === 'delete'){

         }else if(interaction.options.getSubcommand() === 'view'){

         }else if(interaction.options.getSubcommand() === 'help'){

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

         }else if(interaction.options.getSubcommand() === 'view'){

         }else{
            await interaction.reply({content:'Something went wrong with the recipe command.', ephemeral:true});
         }
      }
   }
};
