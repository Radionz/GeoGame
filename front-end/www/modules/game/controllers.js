angular.module('Game')

.controller('GameCtrl', function($scope, GameService, QuestionService, $stateParams) {

  $('.scroll').height('100%');

  var image = {
    url: 'img/question_marker.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 8)
  };

  $scope.$on("$ionicView.enter", function(event, data){
    initMap();

    var gameId = $stateParams.id;
    GameService.getGame(gameId).then(function(response) {
      var game = response.data;
      game.questionsBody = [];

      angular.forEach(game.questions, function(questionId) {
        QuestionService.getQuestion($scope, questionId);
      });

      $scope.$on('getQuestionOK', function (event, question) {
        game.questionsBody.push(question);
        addQuestionToMap(question);
      });

      $scope.game = game;
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
  };

  function addQuestionToMap(question) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(question.loc.coordinates[1], question.loc.coordinates[0]),
      map: $scope.map,
      icon: image,
      title: question.name,
      animation: google.maps.Animation.DROP
    });

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+question.name+' ( '+question.nb_point+'pts )</h1>'+
    '<div id="bodyContent">'+
    '<p> Question: '+question.question+'</p>'+
    '<p> Answer : '+question.answer+'</p>'+
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open($scope.map, marker);
    });
  };

})

.controller('GameManagerCtrl', function($scope, $interval, GameService, QuestionService) {

  $scope.game = {};
  $scope.game.duration = 90;
  $scope.game.playerNb = 5;

  $scope.$on("$ionicView.enter", function(event, data){
    GameService.getGames().then(function(response) {
      var games = response.data;

      //If the game is started we start the count down of play time remaining
      angular.forEach(games, function(game) {
        startCountDown(game, $interval);
      });

      $scope.games = games;
    });

    QuestionService.getQuestions();
    $scope.$on('getQuestionsOK', function (event, questions) {
        $scope.questions = questions;
    });
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
    GameService.postGame(game).then(function(response) {
      var game = response.data;
      startCountDown(game, $interval);
      $scope.games.push(game);
    });
  };

  $scope.startGame = function (game, index) {
    GameService.startGame(game).then(function(response) {
      var game = response.data;
      startCountDown(game, $interval);
      $scope.games[index] = game;
    });
  };

  $scope.stopGame = function (game, index) {
    GameService.stopGame(game).then(function(response) {
      var game = response.data;
      stopCountDown(game);
      $scope.games[index] = game;
    });
  };

  $scope.updateGame = function (game, index) {
    GameService.putGame(game).then(function(response) {
      var game = response.data;
      stopCountDown(game);
      $scope.games[index] = game;
    });
  };

  $scope.deleteGame = function (id, index) {
    GameService.deleteGame(id).then(function(response) {
      $scope.games.splice(index, 1);
    });
  };

});
