angular.module('Game')

.controller('GameCtrl', function($scope, GameService, QuestionService, $stateParams) {

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
  }

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
      angular.forEach($scope.games, function(value, key) {
        if (value.status == "STARTED") {
          var timeDiff = (+ new Date()) - new Date(value.started_at);
          var dateDiff = new Date(timeDiff);
          var secondsElapsed = dateDiff.getSeconds();
          var minutesElapsed = dateDiff.getMinutes();
          value.timeElapsed = minutesElapsed + ':' + secondsElapsed;
        }

        // var count = 30;
        // var counter = setInterval(timer, 1000); //1000 will  run it every 1 second
        //
        // function timer() {
        //   count = count - 1;
        //   if (count == -1) {
        //     clearInterval(counter);
        //     return;
        //   }
        //
        //   var seconds = count % 60;
        //   var minutes = Math.floor(count / 60);
        //   var hours = Math.floor(minutes / 60);
        //   minutes %= 60;
        //   hours %= 60;
        //
        //   document.getElementById("timer").innerHTML = hours + "hours " + minutes + "minutes and" + seconds + " seconds left on this Sale!"; // watch for spelling
        //}
      });

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
