const mongoose = require('mongoose');
let isConnected = false;

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
    isConnected = true;
});

mongoose.connection.on('error', (err: Error) => {
    console.error('Error connecting MongoDB:', err);
    process.exit(5);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected to MongoDB!');
});

process.on('SIGINT', async () => {
    if(isConnected) await mongoose.connection.close();
    process.exit(5);
});

export {};