angular.module('Game')

.controller('GameCtrl', function($scope, $rootScope, $state, GameService, QuestionService, UserService, $stateParams, $ionicModal) {

  $('.scroll').height('100%');

  var image = {
    url: 'img/question_marker.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 8)
  };

  $scope.$on("$ionicView.enter", function(event, data){
    if (typeof $rootScope.loggedInUser === "undefined") {
      $state.go("app.signIn");
    }else {
      initMap();

      var gameId = $stateParams.id;
      GameService.getGame(gameId).then(function(response) {
        var game = response.data;

        UserService.getUser($rootScope.loggedInUser._id).then(function(response) {
          var user = response.data;
        });

        var alreadyIn = false;
        angular.forEach(game.scoreBoard, function(scoreBoardEntry) {
          if (scoreBoardEntry.userId == $rootScope.loggedInUser._id) {
            alreadyIn = true;
            return;
          }
        });

        if (!alreadyIn) {
          var scoreBoardEntry = {};
          scoreBoardEntry.userId = $rootScope.loggedInUser._id;
          scoreBoardEntry.score = 0;
          game.scoreBoard.push(scoreBoardEntry);

          GameService.putGame(game).then(function(response) {
          });
        }

        game.questionsBody = [];
        angular.forEach(game.questions, function(questionId) {
          QuestionService.getQuestion(questionId).then(function(response) {
            var question = response.data;
            game.questionsBody.push(question);
            addQuestionToMap(question);
          });
        });

        $scope.game = game;
      });

      console.log($rootScope.loggedInUser);

      $scope.$on("$ionicView.leave", function(event, data){

      });
    }
  });



  function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.6221174, lng: 7.0391009},
      streetViewControl: false,
      zoom: 14
    });
    addYourLocationButton($scope.map);

    $ionicModal.fromTemplateUrl('modules/game/views/modal-scoreBoard.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    addViewScoreBoardButton($scope.map).addEventListener('click', function() {
      $scope.modal.show();
    });
  };

  function addQuestionToMap(question) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(question.loc.coordinates[1], question.loc.coordinates[0]),
      map: $scope.map,
      icon: image,
      title: question.name,
      animation: google.maps.Animation.DROP
    });

    var circle = new google.maps.Circle({
      map: $scope.map,
      center: marker.position,
      radius: question.radius,    // 10 miles in metres
      fillColor: '#AA0000',
      fillOpacity: 0.5
    });
    //circle.bindTo('center', marker, 'position');

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

  $scope.$on("$ionicView.enter", function(event, data){
    GameService.getGames().then(function(response) {
      var games = response.data;

      //If the game is started we start the count down of play time remaining
      angular.forEach(games, function(game) {
        startCountDown(game, $interval);
      });

      $scope.games = games;
    });

    QuestionService.getQuestions().then(function(response) {
      var questions = response.data;
      $scope.questions = questions;
    });

    $scope.initForm();
  });

  $scope.initForm = function () {
    $scope.formGame = {};
    angular.forEach($scope.questions, function(question) {
      question.checked = false;
    });
    $scope.formGame.duration = 90;
    $scope.formGame.playerNb = 5;
  }

  $scope.questionSelected = function () {
    $scope.formGame.questions = [];
    angular.forEach($scope.questions, function(value, key) {
      if (value.checked == true) {
        $scope.formGame.questions.push(value._id);
      }
    });
  };

  $scope.createGame = function (game) {
    GameService.postGame(game).then(function(response) {
      var game = response.data;
      startCountDown(game, $interval);
      $scope.games.push(game);
      $scope.initForm();
    });
  };

  $scope.startGame = function (game, index) {
    GameService.startGame(game._id).then(function(response) {
      var game = response.data;
      startCountDown(game, $interval);
      $scope.games[index] = game;
    });
  };

  $scope.stopGame = function (game, index) {
    GameService.stopGame(game._id).then(function(response) {
      var game = response.data;
      stopCountDown(game);
      $scope.games[index] = game;
    });
  };

  $scope.updateGameInForm = function (game, index) {
    $scope.initForm();
    game.index = index;
    angular.forEach(game.questions, function(questionId) {
      angular.forEach($scope.questions, function(question) {
        if (question._id == questionId) {
          question.checked = true;
        }
      });
    });
    $scope.formGame = angular.copy(game);
  };

  $scope.updateGame = function (game) {
    var index = game.index;
    game.status = "NOT_STARTED";
    GameService.putGame(game).then(function(response) {
      var game = response.data;
      stopCountDown(game);
      $scope.games[index] = game;
      $scope.initForm();
    });
  };

  $scope.deleteGame = function (id, index) {
    GameService.deleteGame(id).then(function(response) {
      $scope.games.splice(index, 1);
    });
  };

});
