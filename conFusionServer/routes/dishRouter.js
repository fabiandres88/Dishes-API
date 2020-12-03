const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (error) => next(error))
            .catch((error) => next(error))
    })

    .put((req, res, next) => {
        res.end('PUT operation not supported on /dishes.');
    })

    .delete((req, res, next) => {
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 204;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (error) => next(error))
            .catch((error) => next(error));
    });

dishRouter.route('/:dishId')

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'
            + req.params.dishId);
    })

    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .delete((req, res, next) => {
        Dishes.findByIdAndDelete(req.params.dishId)
            .then((response) => {
                res.statusCode = 204;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (error) => next(error))
            .catch((error) => next(error));
    });

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    error = new Error('Dish ' + req.params.dishId + ' not found');
                    error.status = 404;
                    return next(error);
                }
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save((dish))
                        .then((dish) => {
                            console.log('Dish Created', dish);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (error) => next(error));
                }
                else {
                    error = new Error('Dish ' + req.params.dishId + ' not found');
                    error.status = 404;
                    return next(error);
                }
            }, (error) => next(error))
            .catch((error) => next(error))
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
    })

    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (let i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save((dish))
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (error) => next(error));
                }
                else {
                    error = new Error;
                    error.status = 404;
                    return next(error);
                }
            }, (error) => next(error))
            .catch((error) => next(error));
    });

dishRouter.route('/:dishId/comments/:commentId')

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    error = new Error('Dish ' + req.params.dishId + ' not found');
                    error.status = 404;
                    return next(error);
                } else {
                    error = new Error('Comment ' + req.params.commentId + ' not found');
                    error.status = 404;
                    return next(error);
                }

            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'
            + req.params.dishId + '/comments/' + req.params.commentId);
    })

    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (error) => next(error));
                } else if (dish == null) {
                    error = new Error('Dish ' + req.params.dishId + ' not found');
                    error.status = 404;
                    return next(error);
                } else {
                    error = new Error('Comment ' + req.params.commentId + ' not found');
                    error.status = 404;
                    return next(error);
                }
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 204;
                            res.setHeader('content-Type', 'application/json');
                            res.json(dish);
                        }, (error) => next(error));
                } else if (dish == null) {
                    error = new Error('Dish ' + req.params.dishId + ' not found');
                    error.status = 404;
                    return next(error);
                } else {
                    error = new Error('Comment ' + req.params.commentId + ' not found');
                    error.status = 404;
                    return next(error);
                }
            }, (error) => next(error))
            .catch((error) => next(error));
    });

module.exports = dishRouter;
