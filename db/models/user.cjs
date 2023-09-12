'use strict';

// import pkg from 'sequelize';
const { Model } = require('sequelize');

class User extends Model {}

module.exports = {
	User: User,
};
