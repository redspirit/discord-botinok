
const Discord = require('discord.js');
const client = new Discord.Client();
const Botinok = require('./Botinok');


const start = (config) => {

    let token = config.token;
    let prefix = config.prefix;
    let ownerId = config.ownerId;

    if(!token) throw new Error('token required');
    if(!prefix) throw new Error('prefix required');

    let botinok = new Botinok({ownerId, prefix});

    botinok.setClient(client);

    client.login(token);

    return client;

};

const registerModule = (config) => {
    // todo check config
    config.isMiddleware = false;
    Botinok.addModule(config);
};

const registerMiddleware = (config) => {
    // todo check config
    config.isMiddleware = true;
    Botinok.addModule(config);
};


module.exports = { start, registerModule, registerMiddleware };