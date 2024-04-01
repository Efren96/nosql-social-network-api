const user = require('../models/user');
const thought = require('../models/thought')

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await user.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        user.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID.' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create a new user
    async createUser(req, res) {
        try {
            const dbUserData = await user.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    async deleteUser(req, res) {
        try {
            user.findOneAndRemove({ _id: req.params.userId });
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID.' });
            }
            await thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and thoughts deleted.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateUser(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        ).then((user) => {
            !user
            ? res.status(404).json({ message: 'No user found'}) 
            :res.json(user);
        }).catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No friends found with that ID.' })
                    : res.json(user)).catch((err) => res.status(500).json(err));
    },

   deleteFriend(req, res) {
user.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            ).then((user) => 
            !user
            ? res.status(404).json({ message: 'No friends found with that ID'})
            : res.json(user))
            .catch((err) => res.status(500).json(err));
   }

};