#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const argv = minimist(process.argv.slice(2));

if (argv.h) {
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
	process.exit(0);
}

const timezone = argv.z || moment.tz.guess();
const latitude = argv.n || argv.s * -1;
const longitude = argv.e || argv.w * -1;
const day = argv.d || 1;
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&current_weather=true&timezone=${timezone}`;

const response = await fetch(URL);
const data = await response.json();

if (argv.j) {
	console.log(data);
	process.exit(0);
}

const suffix = day == 0 ? "today." : (day == 1 ? "tomorrow." : `in ${day} days.`);

if (data.daily.precipitation_hours[day] >= 1) {
	console.log(`You might need your galoshes ${suffix}`);
} else {
	console.log(`You will not need your galoshes ${suffix}`);
}