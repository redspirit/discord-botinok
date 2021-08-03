
const _ = require('underscore');

module.exports.findNick = (guild, name) => {
    const member = guild.members.cache.find(member => {
        let nick = member.nickname ? member.nickname.toLowerCase() : '';
        return nick === name.toLowerCase() || member.user.username.toLowerCase() === name.toLowerCase();
    });
    if(!member) return name;
    return member.nickname || member.user.username;
};

module.exports.getIdByNick = (guild, name) => {
    const member = guild.members.cache.find(member => {
        let nick = member.nickname ? member.nickname.toLowerCase() : '';
        return nick === name.toLowerCase() || member.user.username.toLowerCase() === name.toLowerCase();
    });
    if(!member) return null;
    return member.user.id;
};

module.exports.findNickId = (guild, userId) => {
    const member = guild.members.cache.find(member => {
        return member.user.id === userId;
    });
    if(!member) return '(нет на сервере)';
    return member.nickname || member.user.username;
};

module.exports.findUserById = (guild, userId) => {
    const member = guild.members.cache.find(member => {
        return member.user.id === userId;
    });
    if(!member) return null;
    return member.user;
};

String.prototype.clear = function (onlySpaces = false) {
    return onlySpaces ? this.replace(/ +/g, ' ') : this.replace(/\s\s+/g, ' ');
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Number.prototype.round = function (level = 10) {
    return Math.round(this * level) / level;
};

String.prototype.toMention = function() {
    return `<@!${this}>`;
};

Array.prototype.toString = function () {
    return this.filter(item => !!item).join('\n');
};

module.exports.extractUserId = (mention) => {
    let reg = new RegExp("<@.?[0-9]*?>", 'g');
    if(!reg.test(mention)) return null;

    mention = mention.slice(2, -1);
    if (mention.startsWith('!')) mention = mention.slice(1);
    return mention;
};