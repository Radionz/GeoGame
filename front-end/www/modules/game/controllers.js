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
    GameService.getGame($scope, gameId);
    $scope.$on('getGameOK', function (event, data) {
      $scope.game = data;
      console.log($scope.game.questions);
      angular.forEach($scope.game.questions, function(value) {
        QuestionService.getQuestion($scope, value);
      });
      $scope.$on('getQuestionOK', function (event, data) {
        console.log(data);
        addQuestionToMap(data);
      });
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

  // $scope.computeHourAndMinutes = function () {
  //   var hours = Math.floor( $scope.gameSettings.duration / 60),
  //   minutes = $scope.gameSettings.duration % 60;
  //
  //   $scope.gameSettings.hours = hours;
  //   $scope.gameSettings.minutes = minutes;
  // }

  $scope.$on("$ionicView.enter", function(event, data){
    GameService.getGames($scope);
    $scope.$on('getGamesOK', function (event, games) {
      $scope.games = games;

      angular.forEach(games, function(game) {
        game.timeElapsed = "00:00:00";
        if (game.status == "STARTED") {
          var endTime = (+ new Date(game.started_at)) + (game.duration*60*1000);
          var watchTimeRemaining = $interval(function(){
            game.timeElapsed = new Date(endTime) - new Date();
            if(game.timeElapsed<=0){
              $interval.cancel(watchTimeRemaining);
              game.status = "ENDED";
            }
          }, 1000);
        }
      });
      $scope.games = games;
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
      data.timeElapsed = "00:00:00";
      if (data.status == "STARTED") {
        var endTime = (+ new Date(data.started_at)) + (data.duration*60*1000);
        var watchTimeRemaining = $interval(function(){
          data.timeElapsed = new Date(endTime) - new Date();
          if(data.timeElapsed<=0){
            $interval.cancel(watchTimeRemaining);
            data.status = "ENDED";
          }
        }, 1000);
      }
      $scope.games.push(data);
    })
  };

  $scope.startGame = function (game, index) {
    GameService.startGame($scope, game);
    $scope.$on('startGameOK', function (event, data) {
      data.timeElapsed = "00:00:00";
      if (data.status == "STARTED") {
        var endTime = (+ new Date(data.started_at)) + (data.duration*60*1000);
        var watchTimeRemaining = $interval(function(){
          data.timeElapsed = new Date(endTime) - new Date();
          if(data.timeElapsed<=0){
            $interval.cancel(watchTimeRemaining);
            data.status = "ENDED";
          }
        }, 1000);
      }
      $scope.games[index] = data;
    })
  };

  $scope.stopGame = function (game, index) {
    $scope.$on('stopGameOK', function (event, data) {
      data.timeElapsed = "00:00:00";
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
