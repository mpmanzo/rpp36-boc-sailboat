const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { addUser, createCategory, getUserByEmail, getUserById, verifyPassword } = require("../db/postgres.js");
const db = require("../db/postgres.js");

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function verify(email, password, cb) {
      getUserByEmail(email, (err, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user) {
          verifyPassword(email, password, (err, isMatch) => {
            if (err) { return cb(err); }
            if (!isMatch) { return cb(null, false, { message: 'Incorrect email or password.'}); }
            if (isMatch) { return cb(null, {id: user.user_id, firstname: user.firstname, lastname: user.lastname, email: user.email}); }
          });
        }
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, { id: user.id, firstname: user.firstname });
});

passport.deserializeUser(function(user, cb) {
  getUserById(user.id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Router
var router = express.Router();

router.get('/signin', function(req, res, next) {
  res.json({
    passport: req.session.messages,
    message: '🔐'
  });
});

router.post('/signin', function(req, res, next) {
  passport.authenticate('local-signin', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(404).send(info.message)
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({ user: req.user });
    });
  })(req, res, next);
});

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/signup', function(req, res, next) {
  // res.render('signup');
  res.json({
    message: '🔐'
  });
  next();
});

// Create new user and new miscellaneous category for them
router.post('/signup', (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  getUserByEmail(email, async (err, user) => {
    if (err) res.status(err.status).send(err.message);
    if (user) res.status(404).json({ message: 'User already exists.' });
    if (!user) {
      await addUser(firstname, lastname, email, password, async (err, user) => {
        if (err) {
          res.status(err.status).send(err.message);
         } else {
          createCategory({userID: user[0].user_id, category: 'Miscellaneous', color: '#d6e9f2'});
          res.status(201).send(user);
         }
      });
    }
  });
});

module.exports = router;