const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'throught',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual property `fullName` that gets and sets the user's full name
userSchema
    .virtual('friendCount')
    // Getter
    .get(function () {
        return this.friends.length;
    })

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;