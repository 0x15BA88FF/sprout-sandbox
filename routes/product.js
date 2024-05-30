const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/:id', auth, allowAccess('trader', 'producer', 'customer'), (req, res) => {
    res.render('product', {
        products: [
            { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
            { _id: 'sdfdsf0', images: ["/images/avatar.png"], title: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum explicabo minima nisi libero quidem!", rating: 4, currency: 'GHS', price: 59.99, quantity: 'pcs', isInCart: false },
        ],
        reviews: [
            { _id: '', username: 'Random User', avatar: "/images/avatar.png", comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sunt nobis ut, consequuntur distinctio hic vitae officiis nihil obcaecati quidem, pariatur, placeat veniam enim aspernatur dolores eligendi deleniti cupiditate odio?' },
            { _id: '', username: 'Random User', avatar: "/images/avatar.png", comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sunt nobis ut, consequuntur distinctio hic vitae officiis nihil obcaecati quidem, pariatur, placeat veniam enim aspernatur dolores eligendi deleniti cupiditate odio?' },
            { _id: '', username: 'Random User', avatar: "/images/avatar.png", comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sunt nobis ut, consequuntur distinctio hic vitae officiis nihil obcaecati quidem, pariatur, placeat veniam enim aspernatur dolores eligendi deleniti cupiditate odio?' },
            { _id: '', username: 'Random User', avatar: "/images/avatar.png", comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sunt nobis ut, consequuntur distinctio hic vitae officiis nihil obcaecati quidem, pariatur, placeat veniam enim aspernatur dolores eligendi deleniti cupiditate odio?' },
        ]
    });
});

module.exports = router;