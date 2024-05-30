const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('farmer', 'trader'), (req, res) => {
    res.render('newProduct');
});

router.get('/', auth, allowAccess('farmer', 'trader'), (req, res) => {
    res.render('sell', {
        items: [
            { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
        ]
    });
});

module.exports = router;