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
	res.status(200).send({ userId: req.user.id , user: req.user});
});

app.get('/user/:discordUsername', discordLoadId, (req, res) => {
	// get user id via discordUsername
	res.status(200).send({ userId: req.user.id , user: req.user});
});

app.get('/user', async (req, res) => {
	// get user id
	let user = await User.findOne({
		where: {
			name: {
				[Op.eq]: req.name,
			},
		},
	});
	res.status(200).send({ user: user.toJSON(), userId: user.id });
});

app.post('/user/new/', async (req, res) => {
	// build new user
	let user = User.build({ discordUsername: req.discordUsername, twitchUsername: req.twitchUsername });
	await user.save();
	res.status(200).send({ user: user.toJSON() });
});

app.post('/user/:discordUsername', async (req, res) => {
	// update twitch username
	let user = await User.findOne({
		where: {
			discordUsername: {
				[Op.eq]: req.discordUsername,
			},
		},
	});
	user.twitchUsername = req.twitchUsername;
	await user.save();
	res.status(200).send({ user: user.toJSON() });
});

app.delete('/user/delete', async (req, res) => {
	// delete user by id
	const userRemove = await User.findOne({
		where: {
			id: {
				[Op.eq]: req.id,
			},
		},
	});
	if (userRemove) {
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
	const punishments = await Punishment.findAll();
	res.status(200).send({punishments: punishments.toJSON() });
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
	res.status(200).send({punish: punishId.toJSON() });
});

app.get('/punish/:name', async (req, res) => {
	// get punishment by name
	const punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.name,
			},
		},
	});
	res.status(200).send({ punishment: punishment.toJSON() });
});

app.post('/punish/new', async (req, res) => {
	// build new punishment
	let punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.name,
			},
		},
	});
	if (!punishment) {
		punishment = Punishment.build({ name: req.name, description: req.description });
		await punishment.save();
		res.status(200).send({ punishment: punishment.toJSON() });
	}
	else {
		res.status(202).send({ content: 'That name already exists in our database. Please resubmit with a unique name.' });
	}
});

app.post('/punish/:name', async (req, res) => {
	// update votes for punishment
	const punishId = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.name,
			},
		},
	});
	punishId.voteCount += 1;
	await punishId.save();
	res.status(200).send({ punishment: punishId.toJSON() });
});

app.post('/punish/override/', async (req, res) => {
	// mod control to override
	const punishment = await Punishment.findOne({
		where: {
			name: req.punishName,
		},
	});
	if (punishment) {
		punishment.modActivate = !punishment.modActivate;
		await punishment.save();
		res.status(200).send({ vote: punishment.toJSON() });
	}
	else {
		res.status(400).send('No punishment by that name');
	}
});

app.delete('/punish/delete', async (req, res) => {
	// delete punishment
	const punishment = await Punishment.findOne({
		where: {
			name: req.name,
		},
	});
	if (punishment) {
		await punishment.destroy();
		await punishment.save();
		res.status(200).send({ punishment: punishment.toJSON() });
	}
	else {
		res.status(400).send('Punishment doesn\'t exist to delete');
	}
});

// vote routes
app.get('/vote/:punishName', async (req, res) => {
	// get vote if it exists
	try {
		const vote = await Vote.findAll({
			where: {
				id: await Punishment.findOne({
					where: {
						name: req.punishName,
					},
				}),
			},
		});
		res.status(200).send({ vote: vote });
	}
	catch (err) {
		res.status(404).send('Punishment doesn\'t exist');
	}
});

app.post('/vote/new', async (req, res) => {
	// create new vote
	const vote = Vote.build({ userId: req.userId, punishmentId: req.punishId });
	await vote.save();
	res.status(200).send({ vote: vote });
});

if (module.children) {
	app.listen(3000);
	console.log('Express started on port 3000');
}