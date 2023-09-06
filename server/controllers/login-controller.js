const { body, validationResult } = require("express-validator");
const { Users } = require("../models")
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')

// this is reverse of above; kicks user out of login page if theyre logged in. you'll have to update the redirect destination once you've made one.
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    return next()
}

const authenticateLogin = () => {
    return passport.authenticate('local', {
        failureFlash: true,
        successRedirect: "/",
        failureRedirect: "/login"
        })
}

const postlogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({ error: "Authentication failed" });
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }
          return res.status(200).json({ message: "Login successful" });
        });
      })(req, res, next);
};


const validateRegister = [
    body("username").trim().isLength({ min: 1 }).escape(),
    body("password").trim().isLength({ min: 1 }).escape()
  ]

const register = async (req, res) => {

    let usingName = await Users.findOne({ username: req.body.username })
    
      if (usingName) res.send("User already exists");
      if (!usingName) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new Users({
          username: req.body.username,
          password: hashedPassword,
          contacts: []
        });
        await newUser.save();
        req.logIn(newUser, (err) => {
          if (err) throw err;
          res.send("Successfully authenticated");
          console.log('user: ', req.user);
        })
      }
  }

const sendUser = (req, res) => {
    if (req.user) {
        res.status(200).send(req.user)
    } else res.status(404).send('sorry')
}

const logout = (req, res) => {
    req.logOut(() => {
      console.log('logged out');
      res.sendStatus(200);
    });
  }
    

module.exports = { postlogin, validateRegister, authenticateLogin, checkNotAuthenticated, register, sendUser, logout }



/* 
app.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  await Users.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new Users({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log('user:', req.user);
      })
    }
  });
});


app.delete('/logout', (req, res)=> {
  req.logOut(() => {
    console.log('logged out');
    // You can perform additional actions here after logout if needed
    res.sendStatus(200); // Send a response to indicate success
  });
}); */