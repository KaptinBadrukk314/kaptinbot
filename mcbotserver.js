"use strict";

//const fs = require('fs');

require('dotenv').config();

import {User, Punishment, Vote, dbConnect } from './db/db.js'
import {clientTwitch} from './twitch/twitchController.js'
import {clientDiscord} from './discord/discordController.js'

precompileHP();

const db = dbConnect();
