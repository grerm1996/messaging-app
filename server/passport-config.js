const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Users } = require("./models");

// all of this is one big middleware -- it's the first one all server calls get passed thru, in server.js.
function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    console.log("logging in: ", username);
    const user = await Users.findOne({ username: username });
    if (user == null) {
      return done(null, false, { message: "No user with that username" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((user, done) => {
    console.log("serializing");
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findById(id).exec();
      console.log("deserializing");
      done(null, user); // Pass the user object to the done callback
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
