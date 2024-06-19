const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('producer', 'trader', 'consumer', 'driver'), (req, res) => {
    res.render('track', { id: req.params.id });
});

module.exports = router;
