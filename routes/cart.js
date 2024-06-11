const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.post('/:productId', auth, allowAccess('producer', 'trader', 'consumer'), async (req, res) => {
    const { productId } = req.params;
    const userId = req.session.user._id;

    try  {
        const user = await userModel.findById(userId);

        if (user.cart.includes(productId)) { return res.status(400).send({ message: 'Product already in cart' }) }

        await userModel.findByIdAndUpdate({ _id: userId }, { $push: { cart: productId } }, { new: true });
        res.status(200).send({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding product' });
    }
});

router.delete('/:productId', auth, allowAccess('producer', 'trader', 'consumer'), async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.user._id;

    try {
        await userModel.findByIdAndUpdate({ _id: userId }, { $pull: { cart: productId } }, { new: true });
        res.status(200).send({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing product from cart' });
    }
});

module.exports = router;
