"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
  const User = db.define('User', {
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
}
