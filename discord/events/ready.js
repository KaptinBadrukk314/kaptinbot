'use strict';

let readyData = {};
readyData.name = 'ready';
readyData.once = true;
readyData.execute = function execute(client) {
	console.log(`Ready! Logged in as ${client.user.tag}`);
}

export { readyData };