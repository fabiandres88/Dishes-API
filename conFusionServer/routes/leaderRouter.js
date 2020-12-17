var express = require ("express");
var mongoose = require("mongoose");
const bodyParser = require('body-parser');
var Leaders = require("../models/leaders");
const authenticate = require('../authenticate')

const leaderRouter= express.Router();

leaderRouter.use(bodyParser.json());
leaderRouter.route("/")

.get((req, res, next) => {
	Leaders.find({})
	.then((leaders) => {		
		res.statusCode= 200;
		res.setHeader("Content-Type", "Aplication/json");
		res.json(leaders);	
	}, (error) => next(error))
	.catch((error) => next(error))
})

.post(authenticate.verifyUser,(req, res, next)=> {
	Leaders.create(req.body)
	.then((leader) => {		
		res.statusCode= 200;
		res.setHeader("Content-Type", "Aplication/json");
		res.json(leader);	
	}, (error) => next(error))
	.catch((error)=> next(error)) ;
})

.put(authenticate.verifyUser,(req, res , next)=> {
	res.statusCode = 400;
	res.end("PUT operation not allowed on /leaders");
})
.delete(authenticate.verifyUser,(req, res, next) => {
	res.statusCode = 400;
	res.end("DELETE operation not allowed on /leaders");
});

leaderRouter.route("/:leaderId")

.get((req, res, next) => {
	Leaders.findById(req.params.leaderId)
	.then((leader) => {		
			res.statusCode =200;
			res.setHeader("Contren-Type","application/json");
			res.json(leader);				
	}, (error) => next(error))
	.catch((error) => next(error));
})

.post(authenticate.verifyUser,(req, res, next)=> {
	res.statusCode = 400;
	res.end("POST operation not allowed on /leaders"+ req.params.leaderId);
})

.put(authenticate.verifyUser,(req, res , next)=> {
	Leaders.findByIdAndUpdate(req.params.leaderId,{
	$set: req.body
	}, {new: true})
		.then((leader) => {
			res.statusCode= 200;
			res.setHeader("Content-Type","application/json");
			res.json(leader);
	}, (error) => next(error))
	.catch((error) => next(error));	
})

.delete(authenticate.verifyUser,(req, res, next) => {
	Leaders.findByIdAndDelete(req.params.leaderId)
	.then((response) => {
		res.statusCode= 204;
		res.setHeader("Content-Type","application/json");
		res.json(response);
	}, (error) => netx(error))
	.catch((error) => next(error));
});

module.exports = leaderRouter;