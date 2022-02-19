"use strict";

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (db) => {
  const Vote = db.define('Vote', {
     id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     }
  });
  const User = require('./user')(db);
  const Punishment = require('./punishment')(db);

  Vote.belongsTo(User);
  Vote.belongsTo(Punishment);

  return Vote;
}
