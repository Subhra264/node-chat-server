const {app, server, express} = require('./utils/initialize_app');
const HttpError = require('./errors/http-errors');
const PORT = process.env.PORT || 8000;

// require('./utils/initialize_db');
app.use(async (req, res, next) => {
    const error = await HttpError.NotFound();
    next(error);
});

app.use(async (err, req, res, next) => {
    res.status(err.status).json({
        status: err.status,
        message: err.message
    });
});

server.listen(PORT, () => {
    console.log('Server running at', PORT);
})