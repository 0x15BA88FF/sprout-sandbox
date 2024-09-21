const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModels");

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const { _id, accountType } = req.session.user;

    const chats = await chatModel.find({ members: _id });

    res.render('messages', { accountType, chats });
});

router.get('/:userId/new', auth, async (req, res) => {
    const { _id } = req.session.user;
    const userId = req.params.userId;

    let chat = await chatModel.create({ roomName: "New Chat", members: [ _id, userId ] });

    res.redirect(`/messages/${chat._id}`)
});

router.get('/:roomId', auth, async (req, res) => {
    const { _id, username, avatar, accountType } = req.session.user;
    const roomId = req.params.roomId;

    let chat = await chatModel.findById(roomId);

    const messages = await Promise.all(
        chat.messages.map(async message => {
            const user = await userModel.findById(message.fromId);

            return {
                fromId: message.fromId,
                message: message.message,
                date: message.date,
                username: user.username,
                accountType: user.accountType,
                avatar: user.avatar,
            };
        })
    );

    res.render('message', { _id, username, avatar, accountType, roomId, roomName: chat.roomName, messages });
});

router.post('/:roomId/message', auth, async (req, res) => {
    const { _id } = req.session.user;
    const { roomId } = req.params;
    const { message } = req.body;

    const chat = await chatModel.findById(roomId);
    chat.messages.push({ fromId: String(_id), message: message, date: Date.now() });
    await chat.save();

    res.status(200).json({ chat });
});

module.exports = router;