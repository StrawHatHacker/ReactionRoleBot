const Discord = require('discord.js');
const mongoose = require('mongoose');
const readdirp = require('readdirp');
require('dotenv').config();

const RRBot = new Discord.Client({
    disableEveryone: true,
    disableMentions: 'all',
    partials: ['MESSAGE', 'REACTION'],
    presence: {
        activity: {
            name: 'Your roles',
            type: 'WATCHING'
        }
    }
});

RRBot.commands = new Discord.Collection();
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

const loadCommands = async() => {
    for await (const file of readdirp('./events')) {
        const eventName = file.path.split('.')[0];
        const event = require(file.fullPath);

        RRBot.on(eventName, event.bind(null, RRBot));
    };

    for await (const file of readdirp('./commands')) {
        const command = require(file.fullPath);
        RRBot.commands.set(command.name, command);
    };
};

loadCommands().then(async() => {
    const connection = await mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await RRBot.login(process.env.TOKEN);

}).catch(error => {
    console.log(error);
    process.exit();
});