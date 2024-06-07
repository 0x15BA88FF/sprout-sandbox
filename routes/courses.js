const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();

router.get('/', auth, allowAccess('producer', 'trader', 'agent'), (req, res) => {
    res.render('courses', {
        accountType: req.session.user.accountType,
        courses: [
            { _id: 1, title: "Hello world", content: "lorem ipsum doro sit amit." },
            { _id: 1, title: "Hello world", content: "lorem ipsum doro sit amit." },
            { _id: 1, title: "Hello world", content: "lorem ipsum doro sit amit." },
            { _id: 1, title: "Hello world", content: "lorem ipsum doro sit amit." }
        ]
    });
});

module.exports = router;
