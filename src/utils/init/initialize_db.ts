const mongoose = require('mongoose');
let isConnected: boolean = false;

mongoose.connect( process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
    isConnected = true;
});

mongoose.connection.on('error', (err: Error) => {
    console.log('Error connecting MongoDB:', err);
    process.exit();
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected to MongoDB!');
});

process.on('SIGINT', async () => {
    if(isConnected) await mongoose.connection.close();
    process.exit();
});

export {};