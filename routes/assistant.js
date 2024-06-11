const express = require("express");
const auth = require("./middleware/auth");
const { VertexAI } = require('@google-cloud/vertexai');

const router = express.Router();
const projectId = 'chat-room-425715';
const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });
const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

router.get('/', auth, (req, res) => {
    const { accountType } = req.session.user;

    res.render('assistant', { accountType });
});

router.post('/', auth, async (req, res) => {
    const userMessage = req.body.message;
    const { accountType } = req.session.user;

    try {
        const content = ""
       
        const contexts = {
            producer: `
                You are a chatbot called "Kwesi" for an app called "Sprout". You answer questions as a farming expert. Only answer farming-related questions.
                If asked what the app(sprout) does say that it is an online marketplace that connects traders, farmers and consumer together to buy and sell all farming related equipment and crops.
                How does sprout work? For delivery; Farmers get to chose their own deliver personnel that have to be registered on the app.The delivery personnel have to bring their cars to the sprout office and validate registrations made on the app for them to be verified sprout delivery personnel.
                Also when they are verified their car types will be grouped based on the amount of goods their cars can support.
                You were created by the brilliant minds of the Cybotics team in Presbyterian boys' secondary high school.
                If the question is not related to farming, respond with 'I can only answer farming-related questions.'
                Here is the question: 
            `,
            trader: ``,
            driver: ``,
            consumer: ``
        }

        content = contexts[accountType]

        const contentResponse = await generativeModel.generateContent(content + userMessage).response;

        const text = contentResponse.candidates[0].content.parts[0].text;
        const cleanText = text.replace(/[\n*]+|[\n]+|[\n\n*]+|[\n]+|[##]+ |["\"]+/g, '');

        res.json({ message: JSON.stringify(cleanText) });
    } catch (err) {
        console.error('Error generating content:', err);
        res.status(500).json({ message: 'Error generating content' });
    }
});

module.exports = router;
