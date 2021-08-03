
const DropCoin = async (params, message) => {

    let result = Math.random() < 0.5;
    let comment = params.raw.join(' ');

    if(!comment)
        return message.reply('Спросите вопрос у монетки на котороый можно ответить ДА или НЕТ \n' +
            'Пример: `!монетка я успею на автобус?`. За использование тратится **1** :coin:');

    if(comment[comment.length-1] !== '?') comment += '?';

    message.channel.send(`**${comment.capitalize()}** Монетка сказала: ` + (result ? ':x: **НЕТ**' : ':white_check_mark: **ДА**'));

};

module.exports = {
    name: 'coin',
    category: 'games',
    description: 'Flip a coin',
    version: '1.0.0',
    disabled: false,
    activateOnUpdate: true,
    ownerOnly: false,
    commands: [
        {
            command: 'монетка|монета|coin',
            controller: DropCoin,
            help: 'How to use the command'
        }
    ]
};