const mongoose = require('mongoose');

mongoose.connect( process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

mongoose.connection.on('error', (err: Error) => {
    console.log('Error connecting MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected to MongoDB!');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit();
});

export {};