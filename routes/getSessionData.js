const express = require("express");
const auth = require("./middleware/auth");
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
    const session = await deliverySessionModel.findById(req.params.id);

    res.json(session);
});

module.exports = router;