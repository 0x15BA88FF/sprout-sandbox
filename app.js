const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors=require("cors");
const notFound = require('./routes/middleware/notFound');
const serverError = require('./routes/middleware/serverError');
const Message = require('./models/message.js');

const app = express();
const port = 3000 || process.env.PORT;
const MONGOURI = "mongodb://localhost:27017/SPROUTCLUSERS";
const mongoDBSession = require("connect-mongodb-session")(session);
const store = new mongoDBSession({ uri: MONGOURI, collection: "userSessions" });

mongoose.connect(MONGOURI)
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => console.error('MongoDB connection error:\n', err));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: "q7yuh35ntfwev-sdii32ohrfe7d7sugar",
    resave: false,
    saveUninitialized: false,
    store: store
}));

const routesDirectory = path.join(__dirname, 'routes');

fs.readdirSync(routesDirectory).forEach(file => {
    if (file.endsWith('.js')) {
        const filename = file.slice(0, -3);
        const route = require(path.join(routesDirectory, file));

        switch (filename) {
            case 'index':
                app.use("/", route);
                break;
            default:
                if (typeof route === 'function') { app.use(`/${ filename }`, route) }
                else { console.error(`Invalid route handler in ${ file }.`) }
                break;
        }

    }
});
const bodyParser = require('body-parser');
const { VertexAI } = require('@google-cloud/vertexai');
const { timeStamp } = require('console');

const projectId = 'chat-room-425715';

const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash-001',
});

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/messages', async(req, res) => {
    try {
        const messages = await Message.find({},'-_id content sender timestamp').lean()
        res.json(messages)
    } catch (err) {
        console.error("Error fetching messages:", err)
        res.status(500).json({message: 'Error fetching messages'})
    }
});

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Received message:', userMessage);

  try {
    const resp = await generativeModel.generateContent(`You are a chatbot called "Kwesi" for an app called "Sprout". You answer questions as a farming expert. Only answer farming-related questions.
    If asked what the app(sprout) does say that it is an online marketplace that connects traders, farmers and consumer together to buy and sell all farming related equipment and crops.
    How does sprout work? For delivery; Farmers get to chose their own deliver personnel that have to be registered on the app.The delivery personnel have to bring their cars to the sprout office and validate registrations made on the app for them to be verified sprout delivery personnel.
    Also when they are verified their car types will be grouped based on the amount of goods their cars can support.
    You were created by the brilliant minds of the Cybotics team in Presbyterian boys' secondary high school.
    If the question is not related to farming, respond with 'I can only answer farming-related questions.'
    Here is the question: ${userMessage}`);
    const contentResponse = await resp.response 

    const text = contentResponse.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/[\n*]+|[\n]+|[\n\n*]+|[\n]+|[##]+ |["\"]+/g, '');
    console.log('Generated content:', JSON.stringify(cleanText));
    
    const userMsg = new Message({content: userMessage, sender:'user'});
    const botMsg = new Message({content: cleanText, sender:'bot'});
    
    await userMsg.save()
    await botMsg.save()


    res.json({ message: JSON.stringify(cleanText) });
  } catch (err) {
    console.error('Error generating content:', err);
    res.status(500).json({ message: 'Error generating content' });
  }
});



// app.use(notFound)
// app.use(serverError)

app.listen(port, () => console.log(`Server listening on port ${ port }`));

