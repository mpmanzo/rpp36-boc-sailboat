const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sessionPool = require("pg").Pool;
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const authRouter = require("../routes/auth.js");
const db = require("../db/postgres.js");
const path = require('path');

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("client/public"));
app.use('/share/*', express.static("client/public"));
app.use(cookieParser(secret));
app.use(session(sessionConfig));
passport.initialize();
passport.session();
app.use(passport.authenticate('session'));
app.use('/auth', authRouter);

var baseURL = 'http://54.85.127.105/';

app.post('/todo', function(req, res) {
  db.createTodo(req.body)
  .then(result => res.send(result))
})

app.get('/todos', function(req, res) {
  db.getTodos(req.query.id)
  .then(result => res.send(result))
})

app.delete('/todos', function(req, res) {
  console.log(req)
  db.deleteTodo(req.query.todoID)
  .then(res.send('DELETED'))
})

app.post('/category', function(req, res) {
  db.createCategory(req.body)
  .then(result => res.send(result))
})

app.get('/categories', function(req, res) {
  db.getCategories(req.query.id)
  .then(result => res.send(result))
})

app.put('/bookedApt', function(req, res) {
  db.bookAppointment(req.body)
  .then(result => res.send(result))
})

app.get('/appointments', function(req, res) {
  db.getAppointments(req.query.id)
  .then(result => res.send(result))
})

// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
// });

app.get("/test", (req, res) => {
  // res.send("Greetings!");
  res.status(200);
  res.end();
});

// app.delete('/delete', (req, res) => {
//   var todo_id = req.body.id;
//   axios.delete(`http://localhost:3000/tasks/${todo_id}`)
// })
// .then(res => {
//   console.log(res.data);
// })
// .catch((error) => {
//   console.log(error);
// })

app.listen(port, () => {
console.log("listening on port: ", port);
});

module.exports = app;
