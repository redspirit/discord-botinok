
const utils = require('./utils');
const async = require('async');
const _ = require('underscore');
const moment = require('moment');
const Discord = require('discord.js');

class BotinokModule {

    name = null;
    description = null;
    category = null;
    activateOnUpdate = null;
    commands = [];
    isMiddleware = false;
    mwController = null;
    priority = 0;
    moduleDir = '';
    client = '';
    ownerOnly = '';

    constructor(config) {

        this.name = config.name;
        this.category = config.category;
        this.description = config.description;
        this.activateOnUpdate = config.activateOnUpdate;
        this.moduleDir = config.moduleDir;
        this.client = config.client;
        this.ownerOnly = !!config.ownerOnly;
        this.isMiddleware = !!config.isMiddleware;
        this.priority = config.priority || 0;               // todo приоритет пока ни на что не влияет
        this.mwController = config.controller || null;

        if(config.startController) {
            config.startController(config.client);
        }

        if(config.clientEvents) {

            config.clientEvents.forEach(item => {
                config.client.on(item[0], item[1])
            });

        }

        if(!_.isEmpty(config.commands)) {

            this.commands = config.commands.map(item => {
                return {
                    aliases: item.command.split('|'),
                    help: item.help,
                    controller: item.controller
                };
            });

        }

    }

    parseParams({message, args}, cmd) {

        let cmdLen = cmd.split(' ').length;
        args = args.slice(cmdLen);

        if(args.length === 0)
            return {isEmpty: true, raw: [], values: []};

        let getNick = (str) => {
            let mentionId = utils.extractUserId(str);
            if(!mentionId) return false;
            let user = utils.findUserById(message.guild, mentionId) || {};
            user.nick = utils.findNickId(message.guild, mentionId);
            return user;
        };
        let getDate = (str) => {
            let mom = moment(str, 'DD.MM.YYYY', true);
            if(!mom.isValid()) return null;
            return mom.toDate();
        };
        let getTime = (str) => {
            let mom = moment(str, 'HH:mm', true);
            if(!mom.isValid()) return null;
            return mom.toDate();
        };
        let getNumber = (str) => {
            let val = parseInt(str, 10);
            if(isNaN(val)) return false;
            return val;
        };
        let getWord = (str) => {
            return str;
        };

        // расставляем тип каждому токену (аргументу)
        let tokens = args.map(arg => {

            if(getNick(arg)) {
                return {
                    content: arg,
                    type: 'user',
                    value: getNick(arg)
                }
            } else if(getDate(arg)) {
                return {
                    content: arg,
                    type: 'date',
                    value: getDate(arg)
                }
            } else if(getTime(arg)) {
                return {
                    content: arg,
                    type: 'time',
                    value: getTime(arg)
                }
            } else if(getNumber(arg)) {
                return {
                    content: arg,
                    type: 'number',
                    value: getNumber(arg)
                }
            } else {
                return {
                    content: arg,
                    type: 'word',
                    value: getWord(arg)
                }
            }

        });

        return {
            raw: args,
            values: tokens.map(item => item.value),
            isEmpty: false
        };
    }

    async executeController(cmdWIthArgs) {

        // cmdWIthArgs.args;
        // cmdWIthArgs.message;

        if(this.isMiddleware) {

            // todo выглядит это не очень красиво, подумать как обойтись цепочкой без промисов

            return new Promise((resolve, reject) => {
                let timer = setTimeout(resolve, 3000); // если за 3 сек next не вызовится, то вызываем автоматом
                this.mwController(cmdWIthArgs.args, cmdWIthArgs.message, (nextMessage) => {
                    clearTimeout(timer);
                    resolve(nextMessage);
                }).then(result => {
                    clearTimeout(timer);
                    resolve(null);
                });
            });

        }

        if(!cmdWIthArgs.args) {
            return cmdWIthArgs.message;
        }

        // todo тут можно проверить права на команду
        // if(this.ownerOnly && !cmdWIthArgs.message.isOwner) {
        //     cmdWIthArgs.message.reply('нет разрешения для использования этой команды');
        //     return false;
        // }

        let matched = this.commands.filter(item => {

            return item.aliases.filter(alias => {
                let a = alias.split(' ');
                let b = cmdWIthArgs.args.slice(0, a.length);
                return a.join(' ') === b.join(' ');
            }).length > 0;

        })[0];

        if(!matched) return cmdWIthArgs.message;

        let params = this.parseParams(cmdWIthArgs, matched.aliases[0]);

        matched.controller(params, cmdWIthArgs.message, Discord).then();

        return cmdWIthArgs.message;

    }

}

class BotinokFramework {

    client = null;
    ownerId = null;
    prefix = null;
    modulesList = [];

    constructor(config) {
        this.ownerId = config.ownerId;
        this.prefix = config.prefix;
    }

    setClient(client) {
        this.client = client;

        client.on('ready', () => {
            console.info(`Logged in as ${client.user.tag}!`);

            client.user.setPresence({
                status: "online",
                activity: {
                    name: "!помощь",
                    type: "WATCHING"
                }
            });

        });

        client.on('message', async message => {
            if (message.author.bot) return false;

            let parsed = this.parseBotCommand(message.content);
            message.isOwner = message.author.id === this.ownerId;

            if(!parsed) {
                // обычное сообщение без комманды
                return this.findAndExecute({
                    args: null,
                    message: message
                });
            }

            parsed.message = message;
            this.findAndExecute(parsed);

        });

        client.on('messageUpdate', async (oldMessage, newMessage) => {
            newMessage.isUpdate = true;
            client.emit('message', newMessage);
        });

        client.on('clickButton', async (button) => {

        });

    }

    parseBotCommand(content) {
        if(!content.startsWith(this.prefix)) return null;
        const commandBody = content.clear().replace(/[.,]/g,"").slice(this.prefix.length).toLowerCase();
        return {
            args: commandBody.split(' ')
        }
    }

    findAndExecute (commandWIthArgs) {

        let stopExecuting = false;

        async.eachSeries(this.modulesList, async (module) => {
            if(stopExecuting) return false;
            let message = await module.executeController(commandWIthArgs);
            if(message) {
                commandWIthArgs.message = message;
            } else {
                stopExecuting = true;
            }
        });

    }

    addModule(conf) {

        conf.client = this.client;
        let module = new BotinokModule(conf);
        this.modulesList.push(module);

    }

    getModuleByName (name) {
        return this.modulesList.filter(module => {
            return module.name === name;
        })[0];
    }

    getmodules () {
        return this.modulesList.filter(module => !module.isMiddleware).map(module => {
            return _.pick(module, ['name', 'description', 'category', 'ownerOnly']);
        });
    }

}

module.exports = BotinokFramework;
