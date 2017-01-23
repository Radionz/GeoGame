angular.module('Welcome')

.controller('WelcomeCtrl', function($scope, GameService) {

  $scope.$on("$ionicView.enter", function(event, data){

    GameService.getGames($scope).then(function(response) {
      var games = response.data;
      $scope.games = games;
    });

  });

});
