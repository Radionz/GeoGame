angular.module('Game')

.factory('GameService', function($http, ServerEndpoint, $rootScope){
  return {

    getGames: function() {
      return $http({
        url: ServerEndpoint.url + "/game",
        method: "GET"
      });
    },

    getGame: function(id) {
      return $http({
        url: ServerEndpoint.url + "/game/"+id,
        method: "GET"
      });
    },

    postGame: function(game) {
      return $http({
        url: ServerEndpoint.url + "/game",
        method: "POST",
        data: game
      });
    },

    putGame: function(game) {
      var gameId = game._id;
      delete game._id;
      console.log(game);
      return $http({
        url: ServerEndpoint.url + "/game/"+gameId,
        method: "PUT",
        data: game
      });
    },

    startGame: function(gameId) {
      var game = {};
      game.status = "STARTED";
      game.scoreBoard = [];
      game.started_at = new Date().getTime();
      return $http({
        url: ServerEndpoint.url + "/game/"+gameId,
        method: "PUT",
        data: game
      });
    },

    stopGame: function(gameId) {
      var game = {};
      game.status = "NOT_STARTED";
      return $http({
        url: ServerEndpoint.url + "/game/"+gameId,
        method: "PUT",
        data: game
      });
    },

    endGame: function(gameId) {
      var game = {};
      game.status = "ENDED";
      return $http({
        url: ServerEndpoint.url + "/game/"+gameId,
        method: "PUT",
        data: game
      });
    },

    deleteGame: function(id) {
      return $http({
        url: ServerEndpoint.url + "/game/" + id,
        method: "DELETE"
      });
    },

    putScoreBoardEntry: function(game, scoreBoardEntry) {
      var gameId = game._id;
      delete game._id;
      return $http({
        url: ServerEndpoint.url + "/game/" + gameId + "/scoreBoardEntry/" + $rootScope.loggedInUser._id,
        method: "PUT",
        data: scoreBoardEntry
      });
    },

  };
});
