const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");
const purchaseModel = require("../models/purchaseModel");
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, allowAccess('producer', 'consumer', 'trader'), async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.session.user._id);
    const product = await productModel.findById(productId);
    const user = await userModel.findById(userId);

    let isPurchased = false;

    const purchasedProductIdPromises = user.purchases.map(async purchaseId => {
        try {
            const purchase = await purchaseModel.findById(purchaseId);
            return purchase.productId;
        } catch (err) { console.log(err) }
    })
    const purchasedProductsId = await Promise.all(purchasedProductIdPromises);

    if (purchasedProductsId.includes(String(productId))) { isPurchased = true };

    res.render('purchase', { accountType: req.session.user.accountType, product, isPurchased });
});

router.post('/:productId', auth, allowAccess('producer', 'consumer', 'trader'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.user._id;
        const { quantity } = await req.body;

        const author = await userModel.findOne({ products: { $in: [productId] }});

        const purchase = new purchaseModel({ productId, quantity });
        const savedPurchase = await purchase.save();

        const deliverySession = new deliverySessionModel({ purchaseId: purchase._id, driverId: "", producerId: author._id, consumerId: userId });
        const savedDeliverySession = await deliverySession.save();

        await productModel.findByIdAndUpdate(productId, { $inc: { quantity: - quantity } });
        await userModel.findByIdAndUpdate(userId, { $push: { purchases: savedPurchase._id } });
        await userModel.findByIdAndUpdate(userId, { $set: { deliverySession: savedDeliverySession._id } });

        res.redirect("/purchases");
    } catch(err) {
        const productId = req.params.productId;

        res.redirect(`/purchase/${ productId }`);
    }
});

module.exports = router;
