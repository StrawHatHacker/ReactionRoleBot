const GuildModel = require('../models/guild');

module.exports = async(RRBot, message) => {
    if (message.author.bot || message.channel.type !== 'text') return;

    let Guild = await GuildModel.findById(message.guild.id);
    if (!Guild) {
        const newGuild = new GuildModel({
            _id: message.guild.id
        });

        Guild = await newGuild.save();
    };

    const prefix = Guild.prefix;

    if (message.content.startsWith('<@') && message.content.replace(/\D+/g, '') === RRBot.user.id) {
        return message.channel.send(`My prefix on this server is \`${prefix}\``).catch(() => { /*Missing permissions*/ });
    }

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const [cmd, ...args] = message.content.toLowerCase().slice(prefix.length).split(/\s+/g);

    const command = RRBot.commands.find(c => c.name === cmd || c.aliases.includes(cmd));
    if (!command) return;

    command.execute({ RRBot, Guild, message, args }).catch(console.log);
};