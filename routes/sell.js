const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");
const productModel = require("../models/productModel");

const router = express.Router();

router.get('/:id', auth, allowAccess('producer', 'trader'), (req, res) => {
    res.render('newProduct', {
        accountType: req.session.user.accountType,
    });
});

router.get('/', auth, allowAccess('producer', 'trader'), (req, res) => {
    res.render('sell', {
        accountType: req.session.user.accountType,
        items: [
            { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
        ]
    });
});

router.post('/', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const data = await req.body
        const product = new productModel({ images, title, price, minQuantity, maxQuantity, currency, metric, specification } = data);
        const savedProduct = await product.save();

        res.redirect("/sell");

    } catch(err) {
        res.render("newProduct", {
            notifications: [{ level: "error", message: err.message }],
            accountType: req.session.user.accountType,
        });
    }
});

module.exports = router;