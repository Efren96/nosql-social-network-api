const { user, thought, reaction } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await thought.find();
            if (!thoughts) {
                return res.status(404).json({ message: 'No thoughts yet.'});
            }
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await thought.create(req.body);
            const user = await user.findByIdAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { thoughts: thought } },
                { runValidators: true, new: true }
            );  
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
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

    async addReaction(req, res) {
        try {
            const reaction = await reaction.create(req.body)
            const thought = await thought.findByIdAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: reaction } },
                { runValidators: true, new: true }
            );

            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const thought = await thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params._id } } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID.' });
            }
            const reaction = await reaction.findOneAndDelete(req.params._id);
            if (!reaction) {
                return res.status(404).json({ message: 'No reaction with that ID.'});
            }
            res.json({message: 'Reaction deleted.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
};