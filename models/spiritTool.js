"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritTool = db.define('SpiritTool',{
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
  return SpiritTool;
}
