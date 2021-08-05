
const Ctrl = async ({args, message, next}) => {

    console.log('New message:', message.content);

    // stop execution of the module chain
    if(message.author.id === '1234567890') return;

    return next();

};

const onStart = async (client) => {

    client.on('ready', () => {
        console.info(`Bot logged in as ${client.user.tag}`);
    });

};

const guildUpdate = async (guild) => {

    console.log(`Guild ${guild.name} has been updated`);

};

module.exports = {
    name: 'auth',
    startController: onStart,
    controller: Ctrl,
    clientEvents: {
        'guildUpdate': guildUpdate,
    }
};
