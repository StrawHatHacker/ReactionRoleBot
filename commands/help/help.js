const { MessageEmbed } = require('discord.js');
const { upperFirst } = require('../../functions');

module.exports = {
    name: 'help',
    description: 'Shows information for all commands or a specific command',
    syntax: 'help [command]',
    aliases: ['h', 'halp'],
    async execute({ RRBot, Guild, message, args }) {

        const creator = await RRBot.users.fetch('285495027411582977');
        let embed = new MessageEmbed().setColor(process.env.blue);

        if (args.length > 0) {
            const command = RRBot.commands.find(c => c.name === args[0] || c.aliases.includes(args[0]));
            if (!command) return;

            embed.setTitle(upperFirst(command.name))
                .addField('Description', command.description)
                .addField('Syntax', Guild.prefix + command.syntax)
                .addField('Aliases', command.aliases.join(', ') || 'None');

        } else {
            embed.setAuthor(`RRBot - A Reaction Roles Bot`, RRBot.user.displayAvatarURL({ size: 64 }))
                .setThumbnail(RRBot.user.displayAvatarURL({ size: 512 }))
                .setDescription('[Support Server](https://discord.gg/ypEBGHB) | [Invite Me](https://discord.com/api/oauth2/authorize?client_id=725288962176057366&permissions=268697664&scope=bot)')
                .setFooter(`Created By ${creator.tag}`, creator.displayAvatarURL({ size: 64 }));

            for (const c of RRBot.commands) {
                embed.addField(upperFirst(c[1].name), c[1].description);
            };
        };


        message.channel.send(embed).catch(() => { /* Missing Permissions */ });
    }
};