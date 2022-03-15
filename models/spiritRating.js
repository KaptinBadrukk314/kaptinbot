"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritRating = db.define('SpiritRating',{
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     rating:{
        type: DataTypes.INTEGER,
        allowNull: false
     }
  });

  //require other tables to establish relationships
  const SpiritUser = require('./spiritUser')(db);
  const Spirit = require('./spirit')(db);
  const SpiritRecipe = require('./spiritRecipe')(db);

  //create foriegn keys
  SpiritRating.belongsTo(SpiritUser);
  SpiritRating.hasOne(Spirit, {
     foreignKey: {
        allowNull: true
     }
 });
 SpiritRating.hasOne(SpiritRecipe, {
    foreignKey: {
       allowNull: true
    }
 });

 return SpiritRating;
}
