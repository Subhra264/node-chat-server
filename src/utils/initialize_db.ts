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

