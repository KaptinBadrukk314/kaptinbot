'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import * as pkg from './db/db.cjs';
const { dbConnect } = pkg;

import { clientTwitch, precompileHP } from './twitch/twitchController.js';
import { clientDiscord, axiosInst } from './discord/discordController.js';

precompileHP();

await dbConnect();
clientTwitch.twitchAxios(axiosInst);
clientDiscord.login(process.env.TOKEN);
clientTwitch.connect();

