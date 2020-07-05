const ReactionGroupModel = require('../../models/reactionGroup');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'creategroup',
    description: 'Create a new reaction role group',
    syntax: 'creategroup <group name>',
    aliases: ['cg'],
    async execute({ RRBot, message }) {
        try {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Admin permissions');

            // After 100 groups the guild is marked as "spamming" and can't create more groups
            const ReactionGroups = await ReactionGroupModel.countDocuments({ guildId: message.guild.id });
            if (ReactionGroups >= 100) return message.channel.send('You have reached the maximum number of Reaction Groups. Join our support server for more information about this matter');

            const filter = msg => (msg.author.id === message.author.id);

            await message.channel.send(new MessageEmbed()
                .setAuthor('RRBot - Group Creation - Step 1', RRBot.user.displayAvatarURL({ size: 64 }))
                .setColor(process.env.BLUE)
                .setFooter('You have 1 minute')
                .setDescription('Welcome to this interactive session where we will create a new reaction role group in three steps. I hope you have already prepared a message in which I\'ll do my reaction and role adding magic. I need the message and channel ID in order for it to work properly so if you haven\'t done that already, please do so now. Any message will do. You can edit it later.\n\nWhen you are ready, type the channel ID ↓')
            );

            let reply = await message.channel.awaitMessages(filter, { max: 1, time: 60000 });
            if (reply.size < 1) return message.channel.send('Timed out');

            const reactionChannel = message.guild.channels.cache.get(reply.first().content);
            if (!reactionChannel) return message.channel.send('Sorry I can\'t find that channel');
            if (reactionChannel.type !== 'text') return message.channel.send('Channel needs to be a text channel');

            await message.channel.send(new MessageEmbed()
                .setAuthor('RRBot - Group Creation - Step 2', RRBot.user.displayAvatarURL({ size: 64 }))
                .setColor(process.env.BLUE)
                .setFooter('You have 1 minute')
                .setDescription(`You did great! I have ${reactionChannel.toString()} in my memory. Now i need to know the message that I will use for reaction roles\n\nWhen you are ready, type the message ID ↓`)
            );

            reply = await message.channel.awaitMessages(filter, { max: 1, time: 60000 });
            if (reply.size < 1) return message.channel.send('Timed out');

            const reactionMessage = await reactionChannel.messages.fetch(reply.first().content);
            if (!reactionMessage) return message.channel.send('Sorry I couldn\'t find that message');

            await message.channel.send(new MessageEmbed()
                .setAuthor('RRBot - Group Creation - Step 3', RRBot.user.displayAvatarURL({ size: 64 }))
                .setColor(process.env.BLUE)
                .setDescription(`Great! I found the message in ${reactionChannel.toString()}\n\n Now you need to give me roles and an emoji for each of the roles (max. 20)`)
            );

            await loop(RRBot, message, filter).then(async reactionRoles => {
                try {
                    if (reactionRoles.length < 1) return message.channel.send('You didn\'t add any roles hmm');

                    const ReactionGroup = new ReactionGroupModel({
                        messageId: reactionMessage.id,
                        channelId: reactionChannel.id,
                        guildId: message.guild.id,
                        addOnly: false,
                        oneOnly: false,
                        dmUser: false,
                        reactions: reactionRoles
                    });

                    await ReactionGroup.save();
                    await message.channel.send(new MessageEmbed().setColor(process.env.BLUE)
                        .setTitle(`Your reaction role group has been created`)
                        .setDescription(reactionRoles.map(r => `${RRBot.emojis.cache.get(r.emojiId).toString()}  ${message.guild.roles.cache.get(r.roleId).toString()}`))
                    );

                } catch (error) {
                    if (error.httpStatus !== 403) {
                        console.log(error);
                        message.channel.send('There was an error').catch(() => {});
                    };
                };
            }).catch(e => message.channel.send(e.message));

        } catch (error) {
            if (error.httpStatus !== 403) console.log(error);
        } finally {
            console.log('uwu')
        };
    }
};

const loop = async(RRBot, message, filter) => {
    try {
        let reactionRoles = [],
            tries = 0;

        while (reactionRoles.length < 20) {
            // After 40 tries of trying to add roles the loop ends and the code exits
            if (tries > 40) throw new Error('Maximum tries exceeded. Please run the command again');
            tries++;

            await message.channel.send(new MessageEmbed().setColor(process.env.BLUE)
                .setDescription(`Type a role (role mention or role id) and send an emoji seperated by a space ↓\nExample: @Anime 😎`)
                .setFooter('You have 1 minute. Type \'done\' when you are finished')
            );

            const reply = await message.channel.awaitMessages(filter, { max: 1, time: 60000 });
            if (reply.size < 1) throw new Error('Timed out');

            let msg = reply.first().content; // String
            if (msg.toLowerCase() === 'done') return reactionRoles;

            msg = msg.split(/ +/g); // Array

            if (msg.length < 2) {
                await message.channel.send('Not enough arguments. Example: @Anime 😎');
            } else {
                const role = message.guild.roles.cache.get(msg[0].replace(/[^0-9]+/g, ''));
                const emoji = RRBot.emojis.resolve(msg[1].replace(/[^0-9]+/g, ''));

                if (!role) {
                    await message.channel.send('I can\'t find that role');
                } else if (!emoji) {
                    await message.channel.send('I don\'t have access to that emoji');
                } else {
                    reactionRoles.push({ emojiId: emoji.id, roleId: role.id });
                };
            };
        };

        return reactionRoles;

    } catch (error) {
        if (error.httpStatus !== 403) throw new Error(error.message);
    };
};