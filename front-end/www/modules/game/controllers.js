angular.module('Game')

.controller('GameCtrl', function($scope, GameService, $stateParams) {

  var image = {
    url: 'img/question_marker.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 8)
  };

  $scope.$on("$ionicView.enter", function(event, data){
    $('.scroll').height('100%');
    initMap();

    var gameId = $stateParams.id;
    GameService.getGame($scope, gameId);
    $scope.$on('getGameOK', function (event, data) {
      $scope.game = data;
      console.log($scope.game.questions);
    });
  });

  function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.6221174, lng: 7.0391009},
      streetViewControl: false,
      zoom: 14
    });
    addYourLocationButton($scope.map);
    addViewScoreBoardButton($scope.map);
  }
})

.controller('GameManagerCtrl', function($scope, GameService, QuestionService) {

  $scope.game = {};
  $scope.game.duration = 90;
  $scope.game.playerNb = 5;

  // $scope.computeHourAndMinutes = function () {
  //   var hours = Math.floor( $scope.gameSettings.duration / 60),
  //   minutes = $scope.gameSettings.duration % 60;
  //
  //   $scope.gameSettings.hours = hours;
  //   $scope.gameSettings.minutes = minutes;
  // }

  $scope.$on("$ionicView.enter", function(event, data){
    GameService.getGames($scope);
    $scope.$on('getGamesOK', function (event, data) {
      $scope.games = data;
    });

    QuestionService.getQuestions($scope);
    $scope.$on('getQuestionsOK', function (event, data) {
      $scope.questions = data;
    })
  });

  $scope.questionSelected = function () {
    $scope.game.questions = [];
    angular.forEach($scope.questions, function(value, key) {
      if (value.checked == true) {
        $scope.game.questions.push(value._id);
      }
    });
  };

  $scope.createGame = function (game) {
    GameService.postGame($scope, game);
    $scope.$on('postGameOK', function (event, data) {
      $scope.games.push(data);
    })
  };

  $scope.startGame = function (game, index) {
    game.status = "STARTED";
    game.started_at = (+ new Date());
    GameService.putGame($scope, game);
    $scope.$on('deleteGameOK', function (event, data) {
      $scope.games[index] = data;
    })
  };

  $scope.stopGame = function (game, index) {
    game.status = "NOT_STARTED";
    GameService.putGame($scope, game);
    $scope.$on('deleteGameOK', function (event, data) {
      $scope.games[index] = data;
    })
  };

  $scope.deleteGame = function (id, index) {
    GameService.deleteGame($scope, id);
    $scope.$on('deleteGameOK', function (event, data) {
      $scope.games.splice(index, 1);
    })
  };

});
