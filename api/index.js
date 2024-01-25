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
	if (user) {
		res.status(200).send({ userId: user.id, user: user });
	}
	else {
		res.status(400).send('Twitch Username not found');
	}
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
		res.status(200).send({ userId: user.id, user: user });
	}
	else {
		res.status(400).send('Discord Username not found');
	}
});

app.get('/user/all', async (req, res) => {
	const users = await User.findAll();
	res.status(200).send({ users: JSON.stringify(users) });
});

app.post('/user/new/', async (req, res) => {
	// build new user
	const user = User.build({ discordUsername: req.query.discordUsername, twitchUsername: req.query.twitchUsername });
	await user.save();
	res.status(200).send({ user: user.toJSON() });
});

app.put('/user/update/:discordUsername', async (req, res) => {
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
		res.status(404).send('User doesn\'t exist to delete');
	}
});

// punishment routes
app.get('/punish/all', async (req, res) => {
	// get all punishments
	const punishments = await Punishment.findAll();
	if (punishments) {
		res.status(200).send({ punishments: JSON.stringify(punishments) });
	}
	else {
		res.status(404).send('No Punishments Found');
	}
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
	if (punishId) {
		res.status(200).send({ punish: punishId.toJSON() });
	}
	else {
		res.status(404).send('Punishment not found');
	}
});

app.get('/punish', async (req, res) => {
	// get punishment by name
	const punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.query.name,
			},
		},
	});
	if (punishment) {
		res.status(200).send({ punishment: punishment.toJSON() });
	}
	else {
		res.status(404).send('Punishment not found');
	}
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

app.put('/punish/update/:name', async (req, res) => {
	// update description of punishment
	const punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.query.name,
			},
		},
	});
	if (punishment) {
		punishment.description = req.query.description;
		await punishment.save();
		res.status(200).send({ punishment: punishment.toJSON() });
	}
	else {
		res.status(404).send('Punishment not found');
	}
});

async function voteCountUpdate(punishment, adjustment) {
	punishment.voteCount += adjustment;
	await punishment.save();
	return;
}

app.put('/punish/vote/:name', async (req, res) => {
	// update votes for punishment
	const punishId = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]: req.query.name,
			},
		},
	});
	if (punishId) {
		voteCountUpdate(punishId, 1);
		res.status(200).send({ voteCount: punishId.voteCount, punishment: punishId.toJSON() });
	}
	else {
		res.status(404).send('Punishment name not found. No vote added');
	}
});

app.put('/punish/override/:name', async (req, res) => {
	// mod control to override
	const punishment = await Punishment.findOne({
		where: {
			name: req.query.name,
		},
	});
	if (punishment) {
		punishment.modActive = !punishment.modActive;
		await punishment.save();
		res.status(200).send({ modStatus: punishment.modActive, vote: punishment.toJSON() });
	}
	else {
		res.status(404).send('No punishment by that name');
	}
});

app.delete('/punish/delete', async (req, res) => {
	// delete punishment
	const punishment = await Punishment.findOne({
		where: {
			name: {
				[Op.eq]:req.query.name,
			},
		},
	});
	if (punishment) {
		await punishment.destroy();
		await punishment.save();
		res.status(200).send({ content: 'Punishment deleted', punishment: punishment.toJSON() });
	}
	else {
		res.status(404).send('Punishment doesn\'t exist to delete');
	}
});

// vote routes
app.get('/vote/all/name', async (req, res) => {
	// get votes if it exists
	try {
		const votes = await Vote.findAll({
			where: {
				id: await Punishment.findOne({
					where: {
						name: req.query.name,
					},
				}).id,
			},
		});
		res.status(200).send({ votes: JSON.stringify(votes) });
	}
	catch (err) {
		res.status(404).send({ content: 'Punishment doesn\'t exist', err: err });
	}
});

app.post('/vote/new', async (req, res) => {
	// create new vote
	try {
		const vote = Vote.build({
			userId: await User.findOne({
				where: {
					discordUsername: req.query.discordUsername,
				},
			}).id,
			punishmentId: await Punishment.findOne({
				where: {
					name: req.query.name,
				},
			}).id,
		});
		console.log(vote);
		await vote.save();
		// update vote count
		await voteCountUpdate(vote.punishmentId, 1);
		res.status(200).send({ vote: vote });
	}
	catch (err) {
		res.status(404).send('Punishment or User not found');
	}
});

app.delete('/vote/delete/all', async (req, res) => {
	// delete all votes for a punishment
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
		await voteCountUpdate(votes.id, votes.length * -1);
		await votes.destroy();
		await votes.save();
		res.status(200).send({ content: 'Punishment\'s votes deleted', votes: JSON.stringify(votes) });
	}
	catch (err) {
		res.status(404).send('Punishment doesn\'t exist');
	}
});

app.delete('/vote/delete/all/user/:userId', async (req, res) => {
	// delete all votes a user made
	try {
		const votes = await Vote.findAll({
			where: {
				id: await User.findOne({
					where: {
						name: req.query.discordUsername,
					},
				}),
			},
		});
		await voteCountUpdate(votes.id, votes.length * -1);
		await votes.destroy();
		await votes.save();
		res.status(200).send({ content: 'Punishment\'s votes deleted', votes: JSON.stringify(votes) });
	}
	catch (err) {
		res.status(404).send('Punishment doesn\'t exist');
	}
});

app.delete('/vote/delete/all/punish/:userId', async (req, res) => {
	// delete votes for a particular punishment
	try {
		const votes = await Vote.findAll({
			where: {
				id: await Punishment.findOne({
					where: {
						name: req.query.name,
					},
				}),
			},
		});
		await voteCountUpdate(votes.id, votes.length * -1);
		await votes.destroy();
		await votes.save();
		res.status(200).send({ content: 'Punishment\'s votes deleted', votes: JSON.stringify(votes) });
	}
	catch (err) {
		res.status(404).send('Punishment doesn\'t exist');
	}
});

app.listen(3000);
console.log('Express started on port 3000');
