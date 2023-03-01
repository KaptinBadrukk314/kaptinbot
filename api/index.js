'use strict';

import express from 'express';
import { dbConnect, User, Punishment, Vote } from '../db/db.cjs';
import pkg from 'sequelize';
const { Op } = pkg;

let app = express();

let db = await dbConnect();

async function twitchLoadId(req, res, next) {
	let user = await User.findOne({
		where: {
			twitchUsername: {
				[Op.eq]:  req.twitchUsername,
			},
		},
	});
	req.user = user;
	next();
}

async function discordLoadId(req, res, next) {
	let user = await User.findOne({
		where: {
			discordUsername: {
				[Op.eq]:  req.discordUsername,
			},
		},
	});
	req.user = user;
	next();
}

// user routes
app.get('/user/:twitchUsername', twitchLoadId, (req, res) => {
	// get user id via twitchUsername
	res.send();
});
app.get('/user/:discordUsername', discordLoadId, (req, res) => {
	// get user id via discordUsername
	res.send();
});
app.get('/user/:id', (req, res) => {
	// get user id
	res.send();
});
app.post('/user', (req, res) => {
	// build new user
	res.send();
});

// punishment routes

// vote routes

if(module.children){
	app.listen(3000);
	console.log('Express started on port 3000');
}