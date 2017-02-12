var express = require('express');
var router = express.Router();

// var ScoreBoard = require('../models/ScoreBoard.js');
var User = require('../models/User.js');
var Game = require('../models/Game.js');

/* GET /games listing. */
router.get('/', function(req, res, next) {
  Game.find()
  .populate('scoreBoard.user')
  // .populate('scoreBoard')
  // .populate({ path: 'scoreBoard.user', model : User })
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
  // .populate('scoreBoard')
  // .populate({ path: 'scoreBoard.user', model : User })
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
  //console.log(req.body.scoreBoard);
  // Game.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });

  Game.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .populate('scoreBoard.user')
  // .populate('scoreBoard')
  // .populate({ path: 'scoreBoard.user', model : User })
  .exec(function (err, game) {
    if (err) return next(err);
    res.json(game);
  });

  // Game.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });

  // Game.findByIdAndUpdate(req.params.id, req.body, {new: true})
  // .populate('scoreBoard')
  // .populate({ path: 'scoreBoard.user', model : User })
  // .exec(function (err, game) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
});

// router.put('/:id/scoreBoard', function(req, res, next) {
//   console.log(req.body.scoreBoard);
//
//   Game.findById(req.params.id)
//   .populate('scoreBoard')
//   .populate({ path: 'scoreBoard.user', model : User })
//   .exec(function (err, game) {
//     if (err) return next(err);
//     res.json(game);
//
//     User.findById(req.body.scoreBoard.user)
//     .populate('scoreBoard')
//     .populate({ path: 'scoreBoard.user', model : User })
//     .exec(function (err, game) {
//       if (err) return next(err);
//       res.json(game);
//     });
//
//   });
//
// });

router.put('/:gameId/scoreBoardEntry/:userId', function(req, res, next) {
  Game.findById(req.params.gameId)
  .populate('scoreBoard.user')
  // .populate('scoreBoard')
  // .populate({ path: 'scoreBoard.user', model : User })
  .exec(function (err, game) {
    if (err) return next(err);
    for (var i = 0; i < game.scoreBoard.length; i++) {
      if (game.scoreBoard[i].user._id == req.body.user._id) {
        game.scoreBoard[i].loc = req.body.loc;
        game.save();
      }
    }
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
