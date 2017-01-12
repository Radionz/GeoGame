var express = require('express');
var router = express.Router();

var Game = require('../models/Game.js');

/* GET /question listing. */
router.get('/', function(req, res, next) {
    Game.find(function (err, question) {
        if (err) return next(err);
        res.json(question);
    });
});

/* POST /question */
router.post('/', function(req, res, next) {
    Game.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /question/id */
router.get('/:id', function(req, res, next) {
    Game.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /question/:id */
router.put('/:id', function(req, res, next) {
    Game.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /question/:id */
router.delete('/:id', function(req, res, next) {
    Game.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
