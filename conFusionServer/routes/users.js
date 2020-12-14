var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user != null) {
        var error = new Error('User ' + req.body.userName + ' already exist');
        error.status = 403;
        next(error);
      } else {
        return User.create({ userName: req.body.userName, password: req.body.password })
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Sucessful', user: user })
    }, (error) => next(error))
    .catch((error) => {
      next(error);
    })
});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var error = new Error('You are not authenticated');

      res.setHeader('WWW-Authenticate', 'Basic');
      error.status = 401;
      return next(error);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    var username = auth[0];
    var password = auth[1];

    User.findOne({ userName: username })
      .then((user) => {
        if (user === null) {
          var error = new Error('User ' + username + ' does not exist');
          error.status = 403;
          return next(error);
        } 
        else if (user.password !== password) {
          var error = new Error('Your password is incorrect');
          error.status = 403;
          return next(error);
        }
        else if (user.userName === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type','text/plain');
          res.end('You are authenticated') 
        }
      })
      .catch((error) => next(error));
  }
  else {
    res.statuscode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated') 
  }
});

router.get('/logout',(req, res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var error = new Error('You are not loggen in');
    error.status = 403;
    next(error);
  }
});

module.exports = router;
