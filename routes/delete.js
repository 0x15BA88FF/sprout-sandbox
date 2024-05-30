const path = require('path');
const express = require("express");
const auth = require("./middleware/auth");
const deleteFile = require('./middleware/deleteFile');

const router = express.Router();

router.get('/:filename', auth, (req, res, next) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    deleteFile(filePath)(req, res, next);
}, (req, res) => {
    res.send('File deleted successfully');
});

module.exports = router;
