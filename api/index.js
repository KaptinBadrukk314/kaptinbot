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

app.post('/user/:discordUsername/:twitchUsername', (req, res) => {
	// build new user
	res.send();
});

app.post('/user/:id/:twitchUsername', (req, res) => {
	// update twitch username
	res.send();
});

app.delete('/user/:id', async (req, res) => {
	// delete user by id
	const userRemove = await User.findOne({
		where: {
			id: {
				[Op.eq]: req.id,
			},
		},
	});
	if (userRemove){
		await userRemove.destroy();
		await userRemove.save();
		res.status(200).send({text:'User deleted', user: userRemove.toJSON()});
	}
	else {
		res.status(400).send('User doesn\'t exist to delete');
	}
});

// punishment routes
app.get('/punish', async (req, res) => {
	// get all punishments
	const punishment = await Punishment.findAll();
	res.status(200).send({punishments: punishment.toJSON()});
});

app.get('/punish/:id', async (req, res) => {
	// get one punishment by id
	const punishId = await Punishment.findOne({
		where: {
			id: {
				[Op.eq]: req.id,
			},
		},
	});
	res.status(200).send({punish: punishId.toJSON()});
});

app.get('/punish/:name', async (req, res) => {
	// get punishment by name
	res.send();
});

app.post('/punish/:name/:description', async (req, res) => {
	// build new punishment
	let punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: interaction.options.getString('name'),
			},
		},
	});
	if (!punishment) {
		punishment = Punishment.build({ name: interaction.options.getString('name'), description: interaction.options.getString('description') });
		await punishment.save();
		res.status(200).send({ punishment: punishment.toJSON()});
	}
	else {
		res.status(202).send({ content: 'That name already exists in our database. Please resubmit with a unique name.' });
	}
});

app.post('/punish/:name', async (req, res) => {
	// update votes for punishment
	res.send();
});

app.post('/punish/:name/override', async (req, res) => {
	// mod control to override 
	const punishment = await Punishment.findOne({
		where: {
			name: req.punishName,
		},
	});
	if (punishment) {
		punishment.modActivate = !punishment.modActivate;
		await punishment.save();
		res.status(200).send({vote: punishment});
	}
	else {
		res.status(400).send('No punishment by that name');
	}
});

app.delete('/punish/:name', async (req, res) => {
	// delete punishment
	const punishment = await Punishment.findOne({
		where: {
			name: req.name,
		},
	});
	if (punishment) {
		await punishment.destroy();
		await punishment.save();
		res.status(200).send();
	}
	else {
		res.status(400).send('Punishment doesn\'t exist to delete');
	}
});

// vote routes
app.get('/vote/:punishName', async (req, res) => {
	// get vote if it exists
	
});

app.post('/vote/:punishId/:userId', async (req, res) => {
	// create new vote
});

if (module.children){
	app.listen(3000);
	console.log('Express started on port 3000');
}