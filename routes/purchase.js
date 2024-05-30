const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('customer', 'trader'), (req, res) => {
    res.render('purchase', { });
});

module.exports = router;