var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=> {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }).catch((error) => {
    console.error(error);
  })
  });

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (error, user) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: error });
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lasstname)
        user.lastname = req.body.lastname;
      user.save((error, user) => {
        if (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ error: error });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Sucessful' });
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are Sucessfully logged in' });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var error = new Error('You are not logged in');
    error.status = 403;
    next(error);
  }
});

module.exports = router;
