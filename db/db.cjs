'use strict';

 const { Sequelize} = require('sequelize');
// import pkg from 'sequelize';
// const { Sequelize } = pkg;

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'mcdata.sqlite',
});

// require models
// const User = require('./db/models/user')(db);
// const Punishment = require('./db/models/punishment')(db);
// const Vote = require('./db/models/vote')(db);
// import pkg2 from './models/user.cjs';
// const { User, userInit } = pkg2;
const { User, userInit } = require('./models/user.cjs');
// import pkg1 from './models/punishment.cjs';
// const { Punishment, punishmentInit } = pkg1;
const { Punishment, punishmentInit } = require('./models/punishment.cjs');
// import pkg3 from './models/vote.cjs';
// const { Vote, voteInit } = pkg3;
const { Vote, voteInit } = require('./models/vote.cjs');

module.exports = {
	dbConnect: async () => {
		try {
			await db.authenticate();
			await userInit(db);
			await punishmentInit(db);
			await voteInit(db);
			await db.sync();
			console.log('Connection has been established successfully to database.');
			return db;
		}
		catch (error) {
			console.error('Unable to connect to the database:', error);
		}
	},
	'User': User,
	'Punishment': Punishment,
	'Vote': Vote,
}
