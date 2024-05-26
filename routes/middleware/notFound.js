module.exports = (req, res, next) => {
    let err = new Error('Resourse Not Found');
    err.statusCode = 404;
    err.statusMessage = "Page Not Found";

    next(err);
};
