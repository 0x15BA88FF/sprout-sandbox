const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('producer', 'trader', 'agent'), (req, res) => {
    res.render('course', {
        accountType: req.session.user.accountType,
        title: "Hello world",
        content: "## Hello world",
    });
});

module.exports = router;
