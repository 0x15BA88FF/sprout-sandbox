const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");
const purchaseModel = require("../models/purchaseModel");
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();

router.get('/:id', auth, allowAccess('driver'), async (req, res) => {
    const sessionId = req.params.id;

    const deliverySession = await deliverySessionModel.findById(sessionId);
    const from = await userModel.findById(deliverySession.fromId);
    const consumer = await userModel.findById(deliverySession.consumerId);
    const purchase = await purchaseModel.findById(deliverySession.purchaseId);
    const product = await productModel.findById(purchase.productId);

    res.render('deliverySession', { id: req.params.id, from, consumer, purchase, product });
});

module.exports = router;
