"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const SpiritNotes = db.define('SpiritNotes',{
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     description: {
        type: DataTypes.TEXT,
        allowNull: false
     }
   });

   //require other tables to establish relationships
   const SpiritTaste = require('./spiritTaste')(db);
   const SpiritSmell = require('./spiritSmell')(db);
   const SpiritColor = require('./spiritColor')(db);
   const SpiritUser = require('./spiritUser')(db);
   const Spirit = require('./spirit')(db);
   const SpiritRecipe = require('./spiritRecipe')(db);

   //create foriegn keys
   SpiritNotes.belongsTo(SpiritUser);
   //allow note to be for either spirit or recipe 
   SpiritNotes.belongsTo(Spirit, {
      foreignKey: {
         allowNull: true
      }
   });
   SpiritNotes.belongsTo(SpiritRecipe,{
      foreignKey: {
         allowNull: true
      }
   });
   SpiritNotes.hasMany(SpiritSmell);
   SpiritNotes.hasMany(SpiritColor);
   SpiritNotes.hasMany(SpiritTaste);

   return SpiritNotes;
}
