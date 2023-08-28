const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const methodOverride = require('method-override')
const app = express();
const router = express.Router()
const { Users } = require("./models");
require('dotenv').config()
//----------------------------------------- END OF IMPORTS---------------------------------------------------
const mongoDb = process.env.MONGO_URL
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Middleware

/* require("./passport-config")(passport); */
const initializePassport = require('./passport-config')
initializePassport(passport)

app.use(express.json());
app.use((req, res, next) => {
  // Allow requests from the specific origin (your client running on port 5173)
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  
  // Allow credentials to be sent with the request
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Allow specific HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow specific HTTP headersjson
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes

const loginRouter = require('./routes/login-routes')
app.use('/login', loginRouter)
const contactRouter = require('./routes/contact-routes')
app.use('/contacts', contactRouter)

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("server listening on port 4000");
});
