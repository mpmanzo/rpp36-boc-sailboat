const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("../db/postgres.js");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require('path')
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000", // <-- add location of react app we're connecting to .env file
  credentials: true
}));

app.use(session({
  secret: "secretcode", // <-- add secret code to .env file
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser("secretcode"));  // <-- add secret code to .env file

app.use(express.static("client/public"));
app.use('/share/*', express.static("client/public"));

var baseURL = 'http://54.85.127.105/';

// Routes
app.post("/auth/signin", (req, res) => {
  console.log(req.body);
});

app.post("/auth/signup", (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  db.getUser(email, async (err, userData) => {
    if (err) res.status(err.status).send(err.message);
    if (userData.length > 0) res.send('User already exists');
    if (userData.length === 0) {
      await  db.addUser(firstname, lastname, email, password, async (err, userData) => {
        if (err) {
          res.status(err.status).send(err.message);
        } else {
          await res.status(201).send(userData);
        }
      })
    }
  })
});

app.get("/user", (req, res) => {
  console.log(req.body);
});

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

// Start Server
app.listen(port, () => {
console.log("listening on port: ", port);
});

module.exports = app;
