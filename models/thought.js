const { Schema, model } = require('mongoose');
const Reaction = require('./reaction');
const formatDate = require('../utils/dateFormat');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => formatDate(date)
        },
        username:
            {
                type: String,
                required: true,
            },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    })


const Thought = model('thought', thoughtSchema);
console.log(formatDate())

module.exports = Thought;
