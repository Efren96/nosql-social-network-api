const user = require('../models/user');
const thought = require('../models/thought')

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await thought.find();
            if (!thoughts) {
                return res.status(404).json({ message: 'No thoughts yet.' });
            }
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    async createThought(req, res) {
        thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username
        })
            .then((thought) => {
                return user.findOneAndUpdate(
                    { username: req.body.username },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                )
            }).then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Error creating thought.'
                    })
                    : res.json(user)
            ).catch((err) => {
                console.log(err);
                res.status(500).json(err)
            })
    },

    async deleteThought(req, res) {
        try {
            const thought = await user.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID.' });
            };
            res.status(200).json({ message: 'Thought deleted.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await user.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID.' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    addReaction(req, res) {
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404)
                        .json({ message: 'No friends found with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404)
                        .json({ message: 'No thought found with that ID.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};