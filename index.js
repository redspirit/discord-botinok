
const Discord = require('discord.js');
const client = new Discord.Client();
const Botinok = require('./Botinok');

let botinok = null;

const start = (config) => {

    if(botinok) throw new Error('already started');

    let token = config.token;
    let prefix = config.prefix;
    let ownerId = config.ownerId;
    let status = config.status;

    if(!token) throw new Error('token required');
    if(!prefix) throw new Error('prefix required');

    botinok = new Botinok({ownerId, prefix, status});
    botinok.setClient(client);
    client.login(token);

    return client;

};

const addModule = (config) => {
    if(!botinok) throw new Error('start the bot first');
    if(!config.name) throw new Error('module name required');
    if(!config.commands) throw new Error('module commands required');
    config.isMiddleware = false;
    botinok.addModule(config);
};

const addMiddleware = (config) => {
    if(!botinok) throw new Error('start the bot first');
    if(!config.name) throw new Error('module name required');
    config.isMiddleware = true;
    botinok.addModule(config);
};


module.exports = { start, addModule, addMiddleware };
