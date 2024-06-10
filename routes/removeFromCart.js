const express = require("express");
const bodyParser = require('body-parser');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.post('/', auth, allowAccess('producer', 'trader', 'consumer'), async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.user._id;

    try {
        const updatedUser = await userModel.findByIdAndUpdate({ _id: userId }, { $pull: { cart: productId } }, { new: true });
        res.status(200).send({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing product from cart' });
    }
});

module.exports = router;
