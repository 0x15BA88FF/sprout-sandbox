module.exports = (req, res, next) => {
    req.session.isAuth = false;
    res.redirect('/login');
};