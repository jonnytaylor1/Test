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

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: 'Content-Type',
  credentials: true,
  methods: 'PUT, POST, PATCH, DELETE, GET'
}))

const MongoStore = connectStore(session);
await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
console.log('Connected to MongoDB');



const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
})


app.use(session({
  name: SESS_NAME,
  secret: SESS_SECRET,
  rolling:true,
  resave: true,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure:NODE_ENV === 'production',
    maxAge: +SESS_LIFETIME
  }
}));
app.use('/sessions' ,sessionRouter)
app.use('/users' ,usersRouter)
app.use('/requests' ,requestsRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));
}
catch (err){
  console.log(err);
}
})();