module.exports = (err, req, res, next) => {
    let response = res.status(err.statusCode || 500);
    response.statusMessage = err.statusMessage || "Internal Server Error";

    res.render('error', { statusCode: response.statusCode, statusMessage: response.statusMessage });
};