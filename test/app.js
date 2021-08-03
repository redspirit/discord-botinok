
const bot = require('../'); // require discord-botinok
const commandModule = require('./command_module');
const middlewareModule = require('./mw_module');

let client = bot.start({
    token: process.env.BOT_TOKEN, // pass your bot token through an environment variable
    prefix: '!',
    status: 'coin'
});

// bot.addMiddleware(middlewareModule);    // add a middleware module for the bot
bot.addModule(commandModule);           // add a simple command module for the bot