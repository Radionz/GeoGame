angular.module('Welcome')

.controller('WelcomeCtrl', function($scope, GameService) {

  $scope.$on("$ionicView.enter", function(event, data){

    GameService.getGames($scope);
    $scope.$on('getGamesOK', function (event, data) {
      $scope.games = data;
    });

  });

});
