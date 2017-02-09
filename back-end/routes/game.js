var express = require('express');
var router = express.Router();

var Game = require('../models/Game.js');

/* GET /game listing. */
router.get('/', function(req, res, next) {
    Game.find()
      .populate('scoreBoard.user')
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
      .populate('scoreBoard.user')
      .exec(function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /game/:id */
router.put('/:id', function(req, res, next) {
    Game.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .populate('scoreBoard.user')
      .exec(function (err, post) {
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
