'use strict';

import axios from 'axios.js';
import * as dotenv from 'dotenv';
dotenv.config();

const axiosStartData = {};
axiosStartData.name = 'axiosStart';
axiosStartData.once = true;
axiosStartData.execute = function execute() {
	axiosStartData.axiosInst = axios.create({
		baseURL: process.env.API_URL + ':' + process.env.API_PORT,
	});
	console.log('Axios instance created');
};

export { axiosStartData };