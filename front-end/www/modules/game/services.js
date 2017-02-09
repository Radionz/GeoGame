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
      return $http({
        url: ServerEndpoint.url + "/game/"+gameId,
        method: "PUT",
        data: game
      });
    },

    startGame: function(gameId) {
      var game = {};
      game.status = "STARTED";
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
      game.scoreBoard = [];
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
    }

  };
});
