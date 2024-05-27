module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user || !req.session.user.accountType) {
            let err = new Error('Access denied');
            err.statusCode = 403;
            err.statusMessage = "Access denied. Please log in.";

            next(err);
        }

        if (!allowedRoles.includes(req.session.user.accountType)) {
            let err = new Error('Access denied');
            err.statusCode = 403;
            err.statusMessage = "Access denied. You do not have the required permissions.";

            next(err);
        }

        next();
    };
};
