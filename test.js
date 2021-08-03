
const bot = require('./'); // require discord-botinok
const testModule = require('./test_module');

let client = bot.start({
    token: process.env.BOT_TOKEN, // pass your bot token through an environment variable
    prefix: '!'
});

bot.addModule(testModule); // add a simple module for the bot