"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
   const Spirit = db.define('Spirit',{
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
     category: {
        type: DataTypes.STRING,
        allowNull: false
     },
     age:{
        type: DataTypes.INTEGER,
        allowNull: true
     },
     distillery:{
        type: DataTypes.STRING,
        allowNull: true
     },
     region:{
        type: DataTypes.STRING,
        allowNull: true
     }
  });

  const SpiritUser = require('./spiritUser')(db);
  Spirit.belongsTo(SpiritUser);
   return Spirit;
}
