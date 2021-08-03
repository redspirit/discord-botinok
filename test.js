
const bot = require('./index');
const testModule = require('./test_module');

let client = bot.start({
    token: 'ODUyNDQ4OTU3NTkzNjgxOTMw.YMG-9Q.-CVi1DL8t5Zv7mV_Ab3pjg7cDps',
    prefix: '!'
});

bot.registerModule(testModule);