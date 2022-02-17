"use strict";

const { Sequelize } = require('sequelize');

module.exports = (db) => {
  const Topic = db.define('Topic', {
     id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
     }
  });
  return Topic;
}
