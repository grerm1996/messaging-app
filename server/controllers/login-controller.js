const { body, validationResult } = require("express-validator");
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

const authenticateLogin = () => {
  return passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

const postlogin = (req, res, next) => {
  console.log(req.protocol);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    req.logIn(user, (err) => {
      console.log("at auth, doing req.logIn: ", req.session, req.secure);
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
};

const validateRegister = [
  body("username").trim().isLength({ min: 4 }).isAlphanumeric().escape(),
  body("password").trim().isLength({ min: 4 }).isAlphanumeric().escape(),
];

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors });
  }
  let usingName = await Users.findOne({ username: req.body.username });

  if (usingName) res.send("User already exists");
  if (!usingName) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new Users({
      username: req.body.username,
      password: hashedPassword,
      contacts: [],
      avatar: 0,
    });
    await newUser.save();
    req.logIn(newUser, (err) => {
      if (err) throw err;
      console.log("user: ", req.user);
      return res.status(200).send("User registered and logged in successfully");
    });
  }
};

const sendUser = (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else res.status(404).send("sorry");
};

const logout = (req, res) => {
  req.logout(() => {
    console.log("logged out");
    res.sendStatus(200);
  });
};

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}

module.exports = {
  postlogin,
  validateRegister,
  authenticateLogin,
  checkNotAuthenticated,
  register,
  sendUser,
  logout,
};
