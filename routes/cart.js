const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/', auth, allowAccess('trader', 'customer'), (req, res) => {
    res.render('cart', {
        items: [
            { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
        ]
    });
});

module.exports = router;
