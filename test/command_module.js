
const FlipCoin = async ({params, message}) => {

    let result = Math.random() < 0.5;
    let comment = params.raw.join(' ');

    if(!comment)
        return message.reply('Ask a question from a coin, which can be answered YES or NO. Example: `!coin will I catch the bus?`');

    if(comment[comment.length-1] !== '?') comment += '?';

    message.channel.send(`**${comment.capitalize()}** The coin said: ` + (result ? ':x: **NO**' : ':white_check_mark: **YES**'));

};

module.exports = {
    name: 'coin',
    category: 'games',
    description: 'Flip a coin',
    activateOnUpdate: true,
    ownerOnly: false,
    commands: [
        {
            command: 'test|монетка',
            controller: FlipCoin,
        },
        {
            command: 'drop ball|кинуть шарик',
            controller: FlipCoin,
            role: 'moder|admin',
        }
    ]
};
