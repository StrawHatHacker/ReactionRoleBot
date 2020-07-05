const { model, Schema } = require('mongoose');

const ReactionGroupSchema = new Schema({
    messageId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    addOnly: {
        type: Boolean,
        default: false
    },
    oneOnly: {
        type: Boolean,
        default: false
    },
    dmUser: {
        type: Boolean,
        default: false
    },
    reactions: [{
        emojiId: String,
        roleId: String
    }]
}, {
    timestamps: true
});

module.exports = model('reactiongroup', ReactionGroupSchema);