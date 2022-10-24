const db = require("../db/postgres.js");
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(( email, password, done) => {
      console.log('pp email: ', email);
      console.log('pp password: ', password);
      db.getUser(email, (err, user) => {
        if (err) res.status(err.status).send(err.message);
        if (userData.length === 0) return done(null, false);
        if (userData.length > 0) {
          db.validatePassword(email, password, (err, result) => {
            if (err) res.status(err.status).send(err.message);
            if (result.length > 0) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      });
    })
  );

  passport.serializeUser((user, cb) => {
    console.log('serialize user: ', user);
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });

  passport.deserializeUser((user, cb) => {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
};

// module.exports = function(passport) {
//   passport.use(
//     new localStrategy(( email, password, done) => {
//       db.getUser(email, async (err, userData) => {
//         if (err) res.status(err.status).send(err.message);
//         if (userData.length === 0) res.send('User email or password does not match.');
//         if (userData.length > 0) {
//           await  db.validatePassword(email, password, async (err, userId) => {
//             if (err) {
//               res.status(err.status).send(err.message);
//             } else {
//               await res.status(201).send(userData);
//             }
//           })
//         }
//       })
//     })
//   )
// }