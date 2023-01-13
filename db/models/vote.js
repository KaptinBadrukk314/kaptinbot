"use strict";

import pkg from 'sequelize'
const { Sequelize, DataTypes } = pkg;

import {User} from './user.js'
import {Punishment} from './punishment.js'

let Vote = null;

function voteInit(db){
  if(Vote != null){
     Vote = db.define('Vote', {
        id:{
           type: DataTypes.UUID,
           defaultValue: Sequelize.UUIDV4,
           allowNull: false,
           primaryKey: true
        }
     });
     //const User = require('../models/user')(db);
     //const Punishment = require('../models/punishment')(db);

     Vote.belongsTo(User);
     Vote.belongsTo(Punishment);

     return Vote;
  } else {
     console.log("Vote Already Initialized");
  }
}

export { Vote, voteInit };
