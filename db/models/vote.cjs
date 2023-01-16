'use strict';

// import pkg from 'sequelize';
const { Sequelize, DataTypes } = require('sequelize');

// import { User } from './user.cjs';
// import { Punishment } from './punishment.cjs';
const User = require('./user.cjs');
const Punishment = require('./punishment.cjs');

module.exports = {
	'Vote': null,
}

module.exports = {
	'voteInit': (db) => {
		if (Vote != null) {
			Vote = db.define('Vote', {
				id:{
					type: DataTypes.UUID,
					defaultValue: Sequelize.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
			});
			// const User = require('../models/user')(db);
			// const Punishment = require('../models/punishment')(db);

			Vote.belongsTo(User);
			Vote.belongsTo(Punishment);

			return Vote;
		}
		else {
			console.log('Vote Already Initialized');
		}
	}
}
