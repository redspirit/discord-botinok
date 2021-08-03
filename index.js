
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
    // todo check config
    config.isMiddleware = false;
    botinok.addModule(config);
};

const addMiddleware = (config) => {
    // todo check config
    config.isMiddleware = true;
    botinok.addModule(config);
};


module.exports = { start, addModule, addMiddleware };