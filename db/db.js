"use strict";

//const { Sequelize, Op } = require('sequelize');
import pkg from 'sequelize'
const { Sequelize } = pkg;

const db = new Sequelize({
   dialect: 'sqlite',
   storage: 'mcdata.sqlite'
});

//require models
//const User = require('./db/models/user')(db);
//const Punishment = require('./db/models/punishment')(db);
//const Vote = require('./db/models/vote')(db);
import { User, userInit } from './models/user.js'
import { Punishment, punishmentInit } from './models/punishment.js'
import { Vote, voteInit } from './models/vote.js'

async function dbConnect(){
   try {
     await db.authenticate();
     console.log('Connection has been established successfully to database.');
     userInit(db);
     punishmentInit(db);
     voteInit(db);
     await db.sync();
     return db;
   } catch (error) {
     console.error('Unable to connect to the database:', error);
   }
}

export { User, Punishment, Vote, dbConnect };
