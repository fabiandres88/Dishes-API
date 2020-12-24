var express = require("express");
var mongoose = require("mongoose");
const bodyParser = require('body-parser');
var Promotions = require("../models/promotions");
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader("content-Type", "application/json");
                res.json(promotions);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-type", "application/json");
                res.json(promotion);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end("PUT operation not allowed on /promotions");
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end("DELETE operation not allowed on /promotions");
    });

promoRouter.route("/:promotionId")
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById(req.params.promotionId)
            .then((promotion) => {
                res.statuscode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotion);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not allowed on /promotions " + req.params.promotionId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotion);
            }, (error) => next(error))
            .catch((error) => next(error));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndDelete(req.params.promotionId)
            .then((response) => {
                res.statusCode = 204;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
            }, (error) => next(error))
            .catch((error) => next(error));
    });

module.exports = promoRouter;