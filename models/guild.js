const { model, Schema } = require('mongoose');

const GuildSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: '>>'
    },
    donator: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = model('guild', GuildSchema);