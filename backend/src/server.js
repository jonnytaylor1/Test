import express from 'express';
import mongoose from 'mongoose';
import session from "express-session";
import connectStore from "connect-mongo";
import sessionRouter from "./routes/sessions";
import cors from 'cors';
import usersRouter from "./routes/users";
import requestsRouter from "./routes/requests";

const {PORT, NODE_ENV, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME} = process.env;
(async () => {
try{
const app = express();
app.disable('x-powered-by'); //Hides info that the app is powered by express
app.use(express.urlencoded({ extended: true })); //Parses url-encoded bodies. Extended: true - The values of the object body can be of any type.
app.use(express.json()); //Parses JSON bodies

//Allows cross domain requests, credentials true is needed for the sessions to work
app.use(cors({origin: 'http://localhost:3000', allowedHeaders: 'Content-Type', credentials: true, methods: 'PUT, POST, PATCH, DELETE, GET'}))

await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}); //Connect to Mongo database
console.log('Connected to MongoDB');

//Connect-mongo configuration
const MongoStore = connectStore(session);
const sessionStore = new MongoStore({mongooseConnection: mongoose.connection, collection: 'sessions'}); 
app.use(session({
  name: SESS_NAME,
  secret: SESS_SECRET,
  rolling:true, //Saves a new session each time the user returns to the site
  resave: false, 
  saveUninitialized: false,
  store: sessionStore,
  cookie: {httpOnly: true, secure:NODE_ENV === 'production', maxAge: +SESS_LIFETIME} //https://owasp.org/www-community/HttpOnly - http only prevents the cookie from being accessed client side
}));

//Routes
app.use('/sessions' ,sessionRouter)
app.use('/users' ,usersRouter)
app.use('/requests' ,requestsRouter)

//Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({error: {status: err.status || 500, message: err.message}})
});

//Connect to port 
app.listen(PORT, () => console.log('Listening on port ' + PORT));

}
catch (err) {console.log(err);}
})();