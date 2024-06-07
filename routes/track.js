const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('trader', 'consumer', 'agent'), (req, res) => {
    res.render('track', {
        accountType: req.session.user.accountType,
    });
});

module.exports = router;
