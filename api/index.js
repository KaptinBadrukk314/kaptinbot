'use strict';

import express from 'express';
import { dbConnect, User, Punishment, Vote } from '../db/db.cjs';
import pkg from 'sequelize';
const { Op } = pkg;

const app = express();

await dbConnect();

// user routes
app.get('/user/twitch/:twitchUsername', async (req, res) => {
	// get user id via twitchUsername
	const user = await User.findOne({
		where: {
			twitchUsername: {
				[Op.eq]:  req.query.twitchUsername,
			},
		},
	});
	res.status(200).send({ userId: user, user: user });
});

app.get('/user/discord/:discordUsername', async (req, res) => {
	// get user id via discordUsername
	console.log(req.query);
	const user = await User.findOne({
		where: {
			discordUsername: {
				[Op.eq]:  req.query.discordUsername,
			},
		},
	});
	console.log(user);
	if (user) {
		res.status(200).send({ userId: user, user: user });
	}
	else {
		res.status(400).send('Discord Username not found');
	}
});

app.get('/user/all', async (req, res) => {
	const users = await User.findAll();
	res.status(200).send({ users: JSON.stringify(users) });
});

// app.get('/user/:name', async (req, res) => {
// 	// get user id
// 	const user = await User.findOne({
// 		where: {
// 			discordUsername: {
// 				[Op.eq]: req.query.name,
// 			},
// 		},
// 	});
// 	res.status(200).send({ user: user.toJSON(), userId: user.id });
// });

app.post('/user/new/', async (req, res) => {
	// build new user
	const user = User.build({ discordUsername: req.query.discordUsername, twitchUsername: req.query.twitchUsername });
	await user.save();
	res.status(200).send({ user: user.toJSON() });
});

app.put('/user/:discordUsername', async (req, res) => {
	// update twitch username
	const user = await User.findOne({
		where: {
			discordUsername: {
				[Op.eq]: req.query.discordUsername,
			},
		},
	});
	user.twitchUsername = req.query.twitchUsername;
	await user.save();
	res.status(200).send({ user: user.toJSON() });
});

app.delete('/user/delete', async (req, res) => {
	// delete user by id
	const userRemove = await User.findOne({
		where: {
			id: {
				[Op.eq]: req.query.id,
			},
		},
	});
	if (userRemove) {
		await userRemove.destroy();
		await userRemove.save();
		res.status(200).send({ text:'User deleted', user: userRemove.toJSON() });
	}
	else {
		res.status(400).send('User doesn\'t exist to delete');
	}
});

// punishment routes
app.get('/punish/all', async (req, res) => {
	// get all punishments
	const punishments = await Punishment.findAll();
	res.status(200).send({ punishments: punishments.toJSON() });
});

app.get('/punish/:id', async (req, res) => {
	// get one punishment by id
	const punishId = await Punishment.findOne({
		where: {
			id: {
				[Op.eq]: req.query.id,
			},
		},
	});
	res.status(200).send({ punish: punishId.toJSON() });
});

app.get('/punish/:name', async (req, res) => {
	// get punishment by name
	const punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.query.name,
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
				[Op.eq]: req.query.name,
			},
		},
	});
	if (!punishment) {
		punishment = Punishment.build({ name: req.query.name, description: req.query.description });
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
				[Op.eq]: req.query.name,
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
			name: req.query.punishName,
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
			name: req.query.name,
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
	// get votes if it exists
	try {
		const votes = await Vote.findAll({
			where: {
				id: await Punishment.findOne({
					where: {
						name: req.query.punishName,
					},
				}),
			},
		});
		res.status(200).send({ votes: JSON.stringify(votes) });
	}
	catch (err) {
		res.status(404).send('Punishment doesn\'t exist');
	}
});

app.post('/vote/new', async (req, res) => {
	// create new vote
	const vote = Vote.build({ userId: req.query.userId, punishmentId: req.query.punishId });
	await vote.save();
	res.status(200).send({ vote: vote });
});


app.listen(3000);
console.log('Express started on port 3000');
