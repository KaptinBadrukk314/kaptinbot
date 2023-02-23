'use strict';
// const { SlashCommandBuilder }= require('@discordjs/builders');
import { SlashCommandBuilder } from '@discordjs/builders';
// import pkg from 'sequelize'
// const Punishment = require('../db/models/punishment')(db);
// import { Punishment } from '../../db/models/punishment.cjs';
import pkg from '../../db/db.cjs';
const { Punishment } = pkg;



const modData = new SlashCommandBuilder()
	.setName('mod')
	.setDescription('Moderator commands for moderating things.')
	.addSubcommand(subcommand => subcommand
		.setName('remove')
		.setDescription('Remove a punishment. (Mod/Admin only)')
		.addStringOption(option => option.setName('name')
			.setDescription('Name of punishment to remove.')
			.setRequired(true)))
	.addSubcommand(subcommand => subcommand
		.setName('activetoggle')
		.setDescription('Toggle active status of a punishment. (Mod/Admin only) Forces toggle of punishment.')
		.addStringOption(option => option.setName('name')
			.setDescription('Name of punishment to Activate.')
			.setRequired(true)))
	.setDefaultPermission(false);

modData.execute = async (interaction) => {
	if (interaction.options.getSubcommand() === 'remove') {
		const beRemoved = interaction.options.getString('name');
		const temp = await Punishment.findOne({
			where: {
				name: beRemoved,
			},
		});
		if (temp) {
			await temp.destroy();
			await temp.save();
			await interaction.reply(`${interaction.user.username} has removed ${beRemoved} from the Punishments.`);
		}
		else {
			await interaction.reply(`${beRemoved} does not exist in Punishments.`);
		}
	}
	else if (interaction.options.getSubcommand() === 'activetoggle') {
		const beActivated = interaction.options.getString('name');
		const temp = await Punishment.findOne({
			where: {
				name: beActivated,
			},
		});
		if (temp) {
			temp.modActivate = !temp.modActivate;
			await temp.save();
			await interaction.reply(`${interaction.user.username} has toggled ${beActivated} to ${temp.modActivate} in Punishments.`);
		}
		else {
			await interaction.reply(`${beActivated} does not exist in Punishments.`);
		}
	}
};

export { modData };
