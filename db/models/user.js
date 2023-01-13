"use strict";

import pkg from 'sequelize'
const { Sequelize, DataTypes } = pkg;

let User = null;

function userInit(db){
  if(User == null){
     User = db.define('User', {
        id: {
           type: DataTypes.UUID,
           defaultValue: Sequelize.UUIDV4,
           allowNull: false,
           primaryKey: true
        },
        discordUsername:{
           type: DataTypes.STRING,
           allowNull: true
        },
        twitchUsername:{
           type: DataTypes.STRING,
           allowNull: true,
           set(value){
              this.setDataValue('twitchUsername', value);
           }
        }
     });
     return User;
  } else {
     console.log("User Already Initialized");
 }
}

export { User, userInit}
