"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritColor = db.define('SpiritColor',{
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     name: {
        type: DataTypes.STRING,
        allowNull: false
     },
     description: {
        type: DataTypes.STRING,
        allowNull: false
     }
   });
   return SpiritColor;
}
