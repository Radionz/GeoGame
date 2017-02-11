var express = require('express');
var router = express.Router();

var ScoreBoard = require('../models/ScoreBoard.js');
var User = require('../models/User.js');
var Game = require('../models/Game.js');

/* GET /games listing. */
router.get('/', function(req, res, next) {
  Game.find()
  .populate('scoreBoard')
  .populate({ path: 'scoreBoard.user', model : User })
  .exec(function (err, game) {
    if (err) return next(err);
    res.json(game);
  });
});

/* POST /game */
router.post('/', function(req, res, next) {
  Game.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /game/id */
router.get('/:id', function(req, res, next) {
  Game.findById(req.params.id)
  .populate('scoreBoard')
  .populate({ path: 'scoreBoard.user', model : User })
  .exec(function (err, game) {
    if (err) return next(err);
    res.json(game);
  });
});

/* GET /game/id */
router.get('/user/:id', function(req, res, next) {
  Game.find({ userTo: req.params.id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /user/:id */
router.put('/:id', function(req, res, next) {
  Game.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:gameId/scoreBoardEntry/:scoreBoardEntryId', function(req, res, next) {
  Game.findById(req.params.gameId)
  .populate({
    path: 'scoreBoard',
    populate: { path: 'user' }
  })
  .exec(function (err, game) {
    if (err) return next(err);
    console.log(game);
  });

  ScoreBoard.findByIdAndUpdate(req.params.scoreBoardEntryId, req.body, {new: true}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /game/:id */
router.delete('/:id', function(req, res, next) {
  Game.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
