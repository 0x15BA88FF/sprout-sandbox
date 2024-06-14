module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let statusMessage = err.statusMessage || "Internal Server Error";

    console.log(`\n\n${ statusCode }\n${ statusMessage }\n\n`)

    res.status(statusCode).render('error', { statusCode, statusMessage });
};
