const express = require("express");
const auth = require("./middleware/auth");

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.render('buy', {
        products: [
            { _id: 'sdfdsf0', title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false, }
        ],
        farmers : [],
        traders: [],
        agents: [],
    });
});

module.exports = router;