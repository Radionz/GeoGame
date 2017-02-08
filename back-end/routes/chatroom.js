var express = require('express');
var router = express.Router();

var ChatRoom = require('../models/ChatRoom.js');

/* GET /chat listing. */
router.get('/', function(req, res, next) {
    ChatRoom.find().populate('messages').exec(function (err, chat) {
        if (err) return next(err);
        res.json(chat);
    });
});

/* POST /chat */
router.post('/', function(req, res, next) {
    ChatRoom.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /chat/id */
router.get('/:id', function(req, res, next) {
    ChatRoom.findById(req.params.id).populate('messages').exec(function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /chat/name/name */
router.get('/name/:name', function(req, res, next) {
    ChatRoom.find({ name: req.params.id }).populate('messages').exec(function (err, chat) {
        if (err) return next(err);
        res.json(chat);
    });
});

/* PUT /chat/:id */
router.put('/:id', function(req, res, next) {
    ChatRoom.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .populate('messages').exec(function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /chat/:id */
router.delete('/:id', function(req, res, next) {
    ChatRoom.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
