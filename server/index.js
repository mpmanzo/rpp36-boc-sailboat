const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionPool = require('pg').Pool;
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const axios = require("axios");
const authRouter = require('../routes/auth.js');
const db = require("../db/postgres.js");

const app = express();
const port = 3000;

const pgPool = db.pool;
const secret = 'team sailboat';
const sessionConfig = {
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
  }),
  name: 'SID',
  secret: secret,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't save session if unmodified
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    aameSite: true,
    secure: false // enable only on https
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // location of the react app we're connecting to
  credentials: true
}));
app.use(express.static("client/public"));
app.use(session(sessionConfig));
app.use(cookieParser(secret));
app.use(passport.authenticate('session'));

// app.use('/auth/signin', authRouter, (req, res) => {
//   res.status(401).send(res.message);
// });

// Auth Routes
app.post('/auth/signin', (req, res) => {
  console.log(req.body);
  res.status(201).json(req.body);
});

app.post('/auth/signup', (req, res) => {
  console.log(req.body);
  res.status(201).send(req.body.email);
});

app.get('/user', (req, res) => {
  console.log(req.body);
})

// Other Routes
app.post('/todo', function(req, res) {
  db.createTodo(req.body)
  .then(result => res.send(result))
})

app.post('/category', function(req, res) {
  db.createCategory(req.body)
  .then(result => res.send(result))
})

app.get('/categories', function(req, res) {
  db.getCategories(req.query.id)
  .then(result => res.send(result))
})

app.get("/test", (req, res) => {
  // res.send("Greetings!");
  res.status(200);
  res.end();
});

// Start server
app.listen(port, () => {
console.log("listening on port: ", port);
});

module.exports = app;
