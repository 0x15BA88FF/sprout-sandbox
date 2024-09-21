const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.render('settings', { accountType: req.session.user.accountType });
});

module.exports = router;
