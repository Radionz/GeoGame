angular.module('Game')

.factory('GameService', function($http, ServerEndpoint){
  return {
    getGames: function($scope) {
      $http({
        url: ServerEndpoint.url + "/game",
        method: "GET"
      }).success(function(data) {
        $scope.$emit('getGamesOK', data);
      })
      .error(function(error, status){
        console.log('ERR | getGames - Problème de communication avec le serveur.');
        $scope.$emit('getGamesKO', error);
      });
    }
  };
});
