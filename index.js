const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5898313016:AAHwV6rs5q-_oQkB4klAJaB-5IuG5ubcG3o'

const bot = new TelegramApi(token, {polling:true})

const chats = {}



const startGame = async (chartId) => {
    await bot.sendMessage(chartId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chartId] = randomNumber;
    await bot.sendMessage(chartId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра - угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chartId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chartId, 'https://chpic.su/_data/stickers/m/mai_sakurajima_love/mai_sakurajima_love_013.webp')
            return bot.sendMessage(chartId,`welcome to Fruit shop! - ${text}`)
        }
        if (text === '/info') {
            return bot.sendMessage(chartId,`Твое имя - ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chartId);
        }
        return bot.sendMessage(chartId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {
        const  data = msg.data;
        const chartId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chartId)
        }
        if (data === chats[chartId]) {
            return  bot.sendMessage(chartId, `красава, угадал на шару ${chats[chartId]}`, againOptions)
        } else {
            return bot.sendMessage(chartId, `неповезло-неповезло, бот загадал цифру ${chats[chartId]}`, againOptions)
        }
    })
}
start()