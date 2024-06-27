const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
    const user = await userModel.findById(req.params.id);

    res.json(user);
});

module.exports = router;