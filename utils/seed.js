const connection = require('../config/connection');
const { user, thought, reaction } = require('../models');

const users = [
    {
        username: 'Amy',
        email: 'amy@gmail.com',
    },
    {
        username: 'Bob',
        email: 'bob@gmail.com',
    },
    {
        username: 'Collin',
        email: 'collin@gmail.com',
    },
    {
        username: 'Dean',
        email: 'dean@gmail.com',
    },
    {
        username: 'Efren',
        email: 'efren@gmail.com',
    },
    {
        username: 'Felix',
        email: 'felix@gmail.com',
    },
    {
        username: 'Gwen',
        email: 'gwen@gmail.com',
    },
]

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    await thought.deleteMany({});
    await user.deleteMany({});

    await user.collection.insertMany(users);

    console.info('Seeding done!');
    ProcessingInstruction.exit(0);
});
