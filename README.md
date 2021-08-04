# discord-botinok
Фреймворк для постройки бота для дискорда на основе discord.js

Ботинок использует модульную систему для реализации обработчиков команд. Модули могут быть двух типов: Command и Middleware.

**Middleware** пропускает через себя все сообщения, который получает бот, можно модифицировать объект message и продолжить выполнение вызвав функцию next().

**Command** описывает конкретную команду, которую нужно выполнить.

## Установка
```sh
npm i discord-botinok
``` 

## Настройка
```js
const bot = require('discord-botinok');
const commandModule = require('./command_module');
const middlewareModule = require('./mw_module');

let client = bot.start({
    token: process.env.BOT_TOKEN,
    prefix: '!',
    status: 'help'
});

bot.addMiddleware(middlewareModule);    // add a middleware module for the bot
bot.addModule(commandModule);           // add a simple command module for the bot
```

## Простой модуль

Создайте файл модуля со следующим кодом:

```js
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
    commands: [
        {
            command: 'coin|монетка',
            controller: FlipCoin,
        }
    ]
};
```

Этот модуль описывает одну команду (в модуле может быть много команд), которая реализует мини игру с подбрасыванием мометки.
Когда бот увидит от другого пользователя сообщение "!coin" он вызовет функцию-обработчик FlipCoin и передаст в нее все параметры и объект Message от библиотеки Discord.js.

## Контакты
Ботинок находится в разработке и активно развивается. Присылайте свои пожелания и предложения:  
Discord: RedSpirit#4057  
GitHub: [redspirit](https://github.com/redspirit)