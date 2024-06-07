const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render('login', { notifications: [] });
});

router.post("/", async (req, res) => {
    try {
        const { email, password } = await req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render('login', {
                notifications: [{ level: "error", message: "This user does not exist." }]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                notifications: [{ level: "error", message: "Invalid email or password" }]
            });
        }

        req.session.isAuth = true;
        req.session.user = user;

        res.redirect("/");

    } catch(err) {
        res.render("login", {
            notifications: [{ level: "error", message: err.message }]
        });
    }
});

module.exports = router;
