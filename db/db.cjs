'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('./models/user.cjs');
const { Punishment } = require('./models/punishment.cjs');
const { Vote } = require('./models/vote.cjs');

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'mcdata.sqlite',
});

async function dbConnect() {
	try {
		User.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			discordUsername:{
				type: DataTypes.STRING,
				allowNull: false,
			},
			twitchUsername:{
				type: DataTypes.STRING,
				allowNull: true,
				set(value) {
					this.setDataValue('twitchUsername', value);
				},
			},
		}, { sequelize: db });
		Punishment.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			voteCount: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			activeFlg:{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
				set(value) {
					this.setDataValue('activeFlg', value);
				},
			},
			modActive:{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
				set(value) {
					this.setDataValue('modActive', value);
				},
			},
		}, { sequelize: db });
		Vote.init({
			id:{
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
		}, { sequelize: db });
		Vote.User = Vote.belongsTo(User);
		Vote.Punishment = Vote.belongsTo(Punishment);
		await db.sync();
		await db.authenticate();
		console.log('Connection has been established successfully to database.');
		return db;
	}
	catch (error) {
		console.error('Unable to connect to the database:', error);
		process.exit(1);
	}
}

exports.dbConnect = dbConnect;
exports.User = User;
exports.Punishment = Punishment;
exports.Vote = Vote;