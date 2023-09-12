'use strict';

// import pkg from 'sequelize';
const { Model } = require('sequelize');

class Vote extends Model {}

module.exports = {
	Vote: Vote,
};
