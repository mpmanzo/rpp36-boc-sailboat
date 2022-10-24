const LocalStrategy = require('passport-local').Strategy;
const { createUser, emailExists, getUser, matchPassword } = require("../db/postgres.js");

module.exports = function(passport) {
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async ( req, email, password, done) => {
        try {
          const userExists = await emailExists(email);

          if (userExists) {
            return done(null, false);
          }
          const user = await createUser(req.body.firstname, req.body.lastname, email, password);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async ( email, password, done) => {
        try {
          const user = await emailExists(email);

          if (!user) {
            return done(null, false);
          }

          const isMatch = await matchPassword(email, password);
          if (!isMatch) return done(null, false);
          return done(null, {id: user.user_id, firstname: user.firstname, lastname: user.lastname, email: user.email});
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    getUser(email, (err, user) => {
      if (err) {
        return cb(err);
      }
      done(err, user);
    });
  });
}