'use strict';

// const fs = require('fs');

require('dotenv').config();

import pkg from './db/db.cjs';
const { dbConnect } = pkg;

import { precompileHP } from './twitch/twitchController.js';
// import { clientDiscord } from './discord/discordController.js';

precompileHP();

const db = dbConnect();

db.close();
