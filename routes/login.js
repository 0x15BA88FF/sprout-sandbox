const express = require("express");

const router = express.Router();
const userModel = require("../models/userModel");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render('login', { notifications: [] });
});

router.post("/", async (req, res) => {
    try {
        const { email, password } = await req.body;
        const userExists = await userModel.findOne({ email });

        if (!userExists) {
            let err = new Error('Invalid user');
            err.message = "This user does not exist."

            return res.render('login', { notifications: [
                { level: "error", message: err.message }
            ]});
        }

        req.session.isAuth = true;
        req.session.user = userExists;

        res.redirect("/");

    } catch(err) {
        res.render("login", { notifications: [
            { level: "error", message: err.message }
        ]});
    }
});

module.exports = router;
