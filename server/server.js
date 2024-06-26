const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");
const app = express();
const router = express.Router();
const { Users } = require("./models");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "https://admin.socket.io/",
      "https://grerm1996.github.io",
      "http://localhost:5173",
    ],
    credentials: true,
  },
});
const initializePassport = require("./passport-config");
require("dotenv").config();
const { instrument } = require("@socket.io/admin-ui");

//----------------------------------------- END OF IMPORTS---------------------------------------------------
const mongoDb = process.env.MONGO_URL;
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

let nowOnline = {};

io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("chat-message-in", (message, convoId) => {
    console.log(
      `User ${socket.id} sending message to conversation ${convoId}: ${message.msgtext}`
    );
    io.in(convoId).emit("chat-message-out", message, (error) => {
      if (error) {
        console.error("Error sending message:", error);
      } else {
        console.log("Message sent successfully");
      }
    });
  });

  socket.on("add-as-online", (username) => {
    nowOnline[socket.id] = username;
    console.log("now online: ", nowOnline);
    io.emit("receive-online-users", nowOnline);
  });

  socket.on("join-room", (convoId) => {
    console.log(`User ${socket.id} joined conversation ${convoId}`);
    socket.join(convoId);
  });

  socket.on("exit-room", (convoId) => {
    console.log(`User ${socket.id} has left conversation ${convoId}`);
    socket.leave(convoId);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    delete nowOnline[socket.id];
    io.emit("receive-online-users", nowOnline);
    console.log("online list: ", nowOnline);
  });
});

instrument(io, {
  auth: false,
});

// Middleware
initializePassport(passport);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");

  // Allow credentials to be sent with the request
  res.header("Access-Control-Allow-Credentials", "true");

  // Allow specific HTTP methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Allow specific HTTP headersjson
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
/* app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { sameSite: "none", secure: true },
  })
); */
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000,
    /*    sameSite: "none",
    secure: true, */
  })
);
app.use((req, res, next) => {
  console.log("after creating session: ", req.session, req.secure);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
//lets passport work with cookie-session
app.use((req, res, next) => {
  if (req.session) {
    req.session.regenerate = (cb) => cb();
    req.session.save = (cb) => cb();
  }
  next();
});
app.use((req, res, next) => {
  req.secure = true;
  next();
});
app.use((req, res, next) => {
  console.log("after the hacky bit: ", req.session, req.originalUrl);
  next();
});

app.use(methodOverride("_method"));

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes

const loginRouter = require("./routes/login-routes");
app.use("/login", loginRouter);
const contactRouter = require("./routes/contact-routes");
app.use("/contacts", contactRouter);
const messageRouter = require("./routes/message-routes");
app.use("/messages", messageRouter);
app.get("/authenticate", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else res.sendStatus(404);
});

function checkNotAuthenticated(req, res, next) {
  {
    return res.redirect("/");
  }
  return next();
}

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("server listening on port 4000");
});

http.listen(3000, () => {
  console.log("socket listening on port 3000");
});
