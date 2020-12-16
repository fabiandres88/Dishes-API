const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config')

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600})    
};

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(options, (jwt_payload, done) => {
    console.log('jwt payload', jwt_payload);
    User.findOne({id: jwt_payload._id}, (error, user) => {
        if(error) {
            return done(error, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', { session: false});