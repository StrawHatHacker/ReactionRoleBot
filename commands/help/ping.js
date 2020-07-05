const { timeConversion } = require('../../functions');
const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'ping',
    description: 'Shows information for the bot',
    syntax: 'ping',
    aliases: [],
    async execute({ RRBot, message }) {

        const uptime = timeConversion(RRBot.uptime);
        const osUptime = timeConversion(os.uptime() * 1000);

        const creator = await RRBot.users.fetch('285495027411582977');

        const time = await message.channel.send(`Pinging...`).catch(() => { /* Missing Permissions */ });
        if (!time) return;

        const embed = new MessageEmbed()
            .setAuthor(`RRBot - A Reaction Roles Bot`, RRBot.user.displayAvatarURL({ size: 64 }))
            .setThumbnail(RRBot.user.displayAvatarURL({ size: 512 }))
            .setColor(process.env.blue)
            .addField('Ping', time.createdTimestamp - message.createdTimestamp + ' ms')
            .addField('Serving', RRBot.guilds.cache.size + ' servers')
            .addField('Uptime', uptime, true)
            .addField('System Uptime', osUptime, true)
            .setFooter(`Created By ${creator.tag}`, creator.displayAvatarURL({ size: 64 }));

        time.edit(null, embed);
    }
};