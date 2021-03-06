var express = require('express');
var bodyParser = require('body-parser');
var Favorite = require('../models/favorite');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .populate("user")
        .populate("dish")
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (error) => next(error))
        .catch((error) => next(error))
});

router.post('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
            if (favorite == null) {
                Favorite.create({ user: req.user._id })
                    .then((favorite) => {
                        for (let i = 0; i < req.body.length; i++) {
                            console.log(req.body[i].dish)
                            favorite.dish.push(req.body[i].dish)
                        }
                        favorite.save(favorite)
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            }, (error) => next(error))
                            .catch((error) => next(error));
                    }, (error) => next(error))
                    .catch((error) => next(error));
            }
            else if (favorite != null) {
                Favorite.findOne({ user: req.user._id })
                    .then((favorite) => {
                        for (let i = 0; i < req.body.length; i++) {
                            console.log(req.body[i].dish)
                            favorite.dish.push(req.body[i].dish)
                        }
                        favorite.save(favorite)
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            }, (error) => next(error))
                            .catch((error) => next(error));
                    })
            }
        }).catch((error) => {
            console.error(error);
        })
});

router.put('/', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'PUT operation not allowed on/favorites ' });
});

router.delete('/', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.remove({})
        .then((response) => {
            res.statusCode = 204;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (error) => next(error))
        .catch((error) => next(error));
});

/*Routes by Id*/

router.get('/:favoriteId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'GET operation not allowed on/:favoriteId ' + req.params.favoriteId });
});

router.post('/:favoriteId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
	if (favorite != null) {
	   favorite.dish.push(req.params.favoriteId)
	   favorite.save()
	   .then((favorite) => {
		res.statusCode= 200;
		res.setHeader("Content-Type", "application/json");
		res.json(favorite);
	   }, (error) => next(error))
	   .catch((error) => next(error));
	}
	else if (favorite == null) {
	   Favorite.create({user: req.user._id})
	   .then((favorite) => {
		favorite.dish.push(req.params.favoriteId)
		favorite.save()
		.then((favorite) => {
		    res.statusCode = 200;
		    res.setHeader("Content-Type", "application/json");
		    res.json(favorite);	
	   }, (error) => next(error))
	   .catch((error) => next(error));
	   }, (error) => next(error))
	   .catch((error) => next(error))
	}
    }, (error) => next(error))
    .catch((error) => next(error));
   
});

router.put('/:favoriteId', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'PUT operation not allowed on/:favoriteId ' + req.params.favoriteId });    
});

router.delete('/:favoriteId', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
	if(favorite != null) {
	   let index = favorite.dish.indexOf(req.params.favoriteId);
	   favorite.dish.split(index,0);
	   favorite.save()
	   .then((favorite) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(favorite);
	   }, (error) => next(error))
	   .catch((error) => next(error));
	}
	else if(favotite == null) {
	    res.statusCode = 400;
	    res.setHeader("Content-Type", "application/json");
	    res.json({dish: req.params.favoriteId }, {message: " This dish is not a favorite"} );	
	}
    }, (error) => next(error))
    .catch((error) => next(error));    
});

module.exports = router;