const express = require('express')
const mongoose = require('mongoose')
const app = express();
const helmet = require('helmet');
const compression = require('compression')
let server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({server: server});
const session = require("express-session")
const connectStore = require("connect-mongo")
const sessionRouter = require("./routes/sessions")
const cors = require('cors')
const usersRouter = require("./routes/users")
const requestsRouter = require("./routes/requests")
const convoRouter = require('./routes/conversations')
const {httpGet} = require('./services/httpFunctions');
const { newConvoURL } = require('./RequestURLs');
require('dotenv').config();

const convertURLQueryToId = (URL)=>{
  return new Promise((resolve, reject)=>{
    let params = new URLSearchParams(URL.slice(2));
    let id = params.get('id');
    resolve(id);
  })
}

const {PORT, NODE_ENV, MONGO_URI, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME} = process.env;
(async () => {
try{
app.use(compression());
app.use(helmet()); //protects application from well known web vulnerabilities
app.use(express.urlencoded({ extended: true })); //Parses url-encoded bodies. Extended: true - The values of the object body can be of any type.
app.use(express.json()); //Parses JSON bodies

//Allows cross domain requests, credentials true is needed for the sessions to work
app.use(cors({origin: 'http://localhost:3000', allowedHeaders: 'Content-Type', credentials: true, methods: 'PUT, POST, PATCH, DELETE, GET'}))

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}); //Connect to Mongo database

const monConnection = mongoose.connection;

//Holds all of the open web sockets
let wsClients = {};

//Once the database is connected
monConnection.once('open', ()=>{
  console.log('MongoDB Connected');

  //Start watching the conversations collection in the database and respond to changes
  const conversationsChangeStream = monConnection.collection('conversations').watch();
  conversationsChangeStream.on('change', async data=>{

    //If a conversation has been created, send information via websockets to the other participant in the conversation
    if(data.operationType==='insert'){
      let conversation = data.fullDocument;
      try{ 
        let conversationObject = await httpGet(newConvoURL + conversation.requester);
            if(wsClients[conversation.requester]) wsClients[conversation.requester].send(JSON.stringify({conversation: conversationObject}));
            if(wsClients[conversation.helper]) wsClients[conversation.helper].send(JSON.stringify({conversation: conversationObject}));
      }
      catch (err){console.log(err);}
    }
})

//When a web socket is connected, add it to the wsClients object
    wss.on('connection', async function connection(ws, req) {
    let userId = await convertURLQueryToId(req.url);
    wsClients[userId] = ws;
    console.log('Websocket user: ' + userId);

    //On an incoming web socket message
    ws.on('message', function incoming(data){
      let conversation = JSON.parse(data);
      
      //If the incoming data contains a message and the receiver of the message is online, send the message via web sockets
      if(conversation.message && wsClients[conversation.message.receiverId]){
        wsClients[conversation.message.receiverId].send(JSON.stringify({conversationNewMessage: {_id: conversation._id, message: conversation.message}}));
      }
      
      //This sends information to the helper when a conversation has been deleted
      if(conversation.sendTo && conversation.sendTo === "helper" && wsClients[conversation.helper._id]){
        wsClients[conversation.helper._id].send(JSON.stringify({deletedConversation: {_id: conversation._id, requester: conversation.requester}})); 
      }

      //This sends information to the requester when a conversation has been deleted
      if(conversation.sendTo && conversation.sendTo === "requester" && wsClients[conversation.requester._id]){
        wsClients[conversation.requester._id].send(JSON.stringify({deletedConversation: {_id: conversation._id}})); 
      }

      //This deletes multiple conversations at once. This is needed when a user removes their account and has multiple active conversations.
      //If the other participant of any of the conversations is online, relevant information is sent to them
      if(conversation.deletedConversations){
        conversation.deletedConversations.forEach(convo => {
          if(wsClients[convo.helper]){
            wsClients[convo.helper].send(JSON.stringify({deletedConversation: {_id: convo._id, requester: convo.requester}})); 
          }
          if(wsClients[convo.requester]){
            wsClients[convo.requester].send(JSON.stringify({deletedConversation: {_id: convo._id}})); 
          }
        });
      }

    })

    //When the websocket closes the websocket is removed from the wsClients array
    ws.on('close', function(){
      delete wsClients[userId];
    })
  })
})


//Connect-mongo configuration
const MongoStore = connectStore(session);
const sessionStore = new MongoStore({mongooseConnection: monConnection, collection: 'sessions'}); 
app.use(session({
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  rolling:true, //Saves a new session each time the user returns to the site
  resave: false, 
  saveUninitialized: false,
  store: sessionStore,
  cookie: {httpOnly: true, secure:NODE_ENV === 'production', maxAge: +SESSION_LIFETIME} //https://owasp.org/www-community/HttpOnly - http only prevents the cookie from being accessed client side
}));

//Routes
app.use('/sessions' ,sessionRouter)
app.use('/users' ,usersRouter)
app.use('/requests' ,requestsRouter)
app.use('/conversations', convoRouter)

//Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({error: {status: err.status || 500, message: err.message}})
});

//Connect to port 
server.listen(PORT, () => console.log('Listening on port ' + PORT));

}
catch (err) {console.log(err);}
})();