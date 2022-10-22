var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var crypto = require('crypto');
var db = require('../db/postgres.js');


/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a user email and password.
 * The strategy parses the user email and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(new LocalStrategy(function verify(email, password, cb) {
  console.log('passport.use: ', email);
  let query = `SELECT * FROM users WHERE email = '${email}' AND password = crypt('${password}', password);`;
  db.get(query, function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect email or password.' }); }
    return cb(null, row);
  });
}));

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and user email.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and user email, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

/* GET /signin
*
* This route prompts the user to log in.
*
* The 'signin' view renders an HTML form, into which the user enters their
* email and password.  When the user submits the form, a request will be
* sent to the `POST /signin/password` route.
*/
router.get('/auth/signin', function(req, res, next) {
  console.log(req.body);
  // res.render('signin');
  res.send('hello: ');
});

/* POST /signin/password
*
* This route authenticates the user by verifying a user email and password.
*
* A user email and password are submitted to this route via an HTML form, which
* was rendered by the `GET /signin` route.  The user email and password is
* authenticated using the `local` strategy.  The strategy will parse the
* user email and password from the request and call the `verify` function.
*
* Upon successful authentication, a signin session will be established.  As the
* user interacts with the app, by clicking links and submitting forms, the
* subsequent requests will be authenticated by verifying the session.
*
* When authentication fails, the user will be re-prompted to signin and shown
* a message informing them of what went wrong.
*/
router.post('/auth/signin/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/signin',
  failureMessage: true
}));

/* POST /logout
*
* This route logs the user out.
*/
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

/* GET /signup
*
* This route prompts the user to sign up.
*
* The 'signup' view renders an HTML form, into which the user enters their
* desired email and password.  When the user submits the form, a request
* will be sent to the `POST /signup` route.
*/
router.get('/auth/signup', function(req, res, next) {
  res.render('signup');
});

/* POST /signup
*
* This route creates a new user account.
*
* A desired user email and password are submitted to this route via an HTML form,
* which was rendered by the `GET /signup` route.  The password is hashed and
* then a new user record is inserted into the database.  If the record is
* successfully created, the user is logged in.
*/
router.post('/auth/signup', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let query = `INSERT INTO users (email, password) VALUES ('${email}', crypt('${password}', gen_salt('bf', 8)));`;

  db.get(query, function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect email or password.' }); }
    return cb(null, row);
  });

  db.run(query, function(err) {
    if (err) { return cb(err); }
    var user = {
      id: this.lastID,
      email: email
    };
    req.login(user, function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
});

module.exports = router;