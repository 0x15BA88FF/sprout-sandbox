module.exports = (req, res, next) => {
    req.session.destroy(err => {
        if (err) { return res.redirect("/"); }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};;