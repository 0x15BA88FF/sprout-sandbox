const express = require("express");
const auth = require("./middleware/auth");

const router = express.Router();

router.get('/', auth, (req, res) => {
    const { accountType } = req.session.user

    if (accountType === 'farmer' || accountType === 'trader') {
        return res.render('dashboard', { });
    } else {
        res.render('buy', {
            products: [
                { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
                { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
            ],
            farmers : [],
            traders: [],
            agents: [],
        });
    }
});

module.exports = router;