const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/', auth, allowAccess('producer', 'trader', 'agent', 'consumer'), (req, res) => {
    const { username } = req.session.user;
    res.render('assistant', { username });
});

module.exports = router;
