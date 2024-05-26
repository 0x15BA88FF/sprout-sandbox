const express = require("express");

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { products: [
        {
            title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!",
            rating: 3,
            currency: 'GHS',
            price: 59.99,
            quantity: 'pcs',
            isInCart: false,
        }
    ]
    });
});

module.exports = router;