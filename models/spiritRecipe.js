"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritRecipe = db.define('SpiritRecipe',{
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
        type: DataTypes.TEXT,
        allowNull: false
     }
  });

  //require other tables to establish relationships
  const SpiritUser = require('./spiritUser');
  const SpiritTool = require('./spiritTool');
  const Spirit = require('./spirit');

  //create foriegn keys
  SpiritRecipe.belongsTo(SpiritUser);
  SpiritRecipe.hasMany(SpiritTool);
  SpiritRecipe.hasMany(Spirit);

  return SpiritRecipe;
}
