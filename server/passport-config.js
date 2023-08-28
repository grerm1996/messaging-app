const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { Users } = require("./models")

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    console.log(username)
    const user = await Users.findOne({ username: username })
    if (user == null) {
      return done(null, false, { message: 'No user with that username' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findById(id).exec();
      done(null, user); // Pass the user object to the done callback
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize/* 




module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await Users.findOne({ username: username });
        
        if (!user) {
          return done(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  
  
  
  passport.serializeUser((user, cb) => {
    console.log('serial: ', user)
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      console.log('deserial: ', userInformation)
      cb(err, userInformation);
    });
  });
};
 */