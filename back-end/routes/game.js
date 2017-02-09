var express = require('express');
var router = express.Router();

var Game = require('../models/Game.js');

/* GET /games listing. */
router.get('/', function(req, res, next) {
  Game.find()
  .populate('scoreBoard.user')
  .exec(function (err, chat) {
    if (err) return next(err);
    res.json(chat);
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
  .populate('scoreBoard.user')
  .exec(function (err, chat) {
    if (err) return next(err);
    res.json(chat);
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

/* DELETE /game/:id */
router.delete('/:id', function(req, res, next) {
  Game.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
