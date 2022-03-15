"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritUser = db.define('SpiritUser',{
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     discordUsername:{
        type: DataTypes.STRING,
        allowNull: false
     }
  });
  return SpiritUser;
}
