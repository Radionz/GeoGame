angular.module('Game')

.controller('GameCtrl', function($scope, $rootScope, $state, GameService, QuestionService, UserService, $stateParams, $ionicModal, $ionicPopup) {

  $('.scroll').height('100%');

  var image = {
    url: 'img/question_marker.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(8, 8)
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

  $scope.getUser = function(userId){
    var currentUser;
    UserService.getUser(userId).then(function(response){
      currentUser = response.data;
    });
    console.log(currentUser);
    return currentUser.name;
  }


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

  $scope.$on("newPosition", function(event, latlng){

    angular.forEach($scope.game.questionsBody, function(question) {
      if(!question.isOpen){
        question.isOpen = false;
      }
      var questionPosition = new google.maps.LatLng(question.loc.coordinates[1], question.loc.coordinates[0]);

      var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, questionPosition);

      $scope.data = {};
      if(distance <= question.radius && !isQuestionAnswered(question.id, $rootScope.loggedInUser.id)){
        var questionPopUp = $ionicPopup.show({
          template: '<input type="text" ng-model="data.answer">',
          title: question.name,
          subTitle: question.question,
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Answer</b>',
              type: 'button-positive',
              onTap: function(e) {
                if ($scope.data.answer != question.answer) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                }
                else {
                  addPointsToScore($rootScope.loggedInUser.id, question);
                }
              }
            }
          ]
        });
      }

    });

  }) ;

  function isQuestionAnswered(questionId, userId){
    angular.forEach($scope.game.scoreBoard, function(scoreBoardEntry){
      if(scoreBoardEntry.userId == userId){
        angular.forEach(scoreBoardEntry.questionsAnswered, function(question){
          if(question == questionId) return true;
        });
      }
    });
    return false;
  }

  function addPointsToScore(userId, question){
    angular.forEach($scope.game.scoreBoard, function(scoreBoardEntry){
      if(scoreBoardEntry.userId == userId){
        scoreBoardEntry.score = scoreBoardEntry.score+question.nb_points;
        scoreBoardEntry.questionsAnswered.push(question.id);
        return;
      }
    });
  }
  // Utils function
  function addYourLocationButton(map) {
    var controlDiv = document.createElement('div');

    var controlUI = document.createElement('button');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = 'none';
    controlUI.style.outline = 'none';
    controlUI.style.width = '28px';
    controlUI.style.height = '28px';
    controlUI.style.borderRadius = '2px';
    controlUI.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginRight = '10px';
    controlUI.style.padding = '0px';
    controlUI.title = 'Your Location';
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.style.position = 'absolute';
    controlText.style.top = '6px';
    controlText.style.left = '6px';
    controlText.style.width = '18px';
    controlText.style.height = '18px';
    controlText.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-cookieless-v2-2x.png)';
    controlText.style.backgroundSize = '180px 18px';
    controlText.style.backgroundPosition = '0px 0px';
    controlText.style.backgroundRepeat = 'no-repeat';
    controlText.id = 'you_location_img';
    controlUI.appendChild(controlText);

    google.maps.event.addListener(map, 'dragend', function() {
      $('#you_location_img').css('background-position', '0px 0px');
    });

    controlUI.addEventListener('click', function() {
      var imgX = '0';
      var animationInterval = setInterval(function(){
        if(imgX == '-18') imgX = '0';
        else imgX = '-18';
        $('#you_location_img').css('background-position', imgX+'px 0px');
      }, 500);
      var watchId;
      var imageTeamOnMap = {
        url: 'img/question_marker.png',
        size: new google.maps.Size(16, 16),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(8, 8)
      };
      var marker = new google.maps.Marker({
        map: map,
        clickable : false,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          strokeColor : '#3333FF',
          strokeWeight : 5,
          scale: 2.5
        },
        shadow : null,
        zIndex : 999
      });

      if(navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition( function(position){
          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.panTo(latlng);
          $scope.$emit("newPosition",latlng);
          marker.setPosition(latlng);
          clearInterval(animationInterval);
          $('#you_location_img').css('background-position', '-144px 0px');
        }, null, {enableHighAccuracy:true});

        function enableOrientationArrow() {

          if (window.DeviceOrientationEvent) {

            window.addEventListener('deviceorientation', function(event) {
              var alpha = null;
              //Check for iOS property
              if (event.webkitCompassHeading) {
                alpha = event.webkitCompassHeading;
              }
              //non iOS
              else {
                alpha = event.alpha;
              }
              var locationIcon = marker.get('icon');
              locationIcon.rotation = 360 - alpha;
              marker.set('icon', locationIcon);
            }, false);
          }
        }

      }
      else{
        clearInterval(animationInterval);
        $('#you_location_img').css('background-position', '0px 0px');
      }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }

  function addViewScoreBoardButton(map) {
    var controlDiv = document.createElement('div');
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show ScoreBoard';
    controlUI.appendChild(controlText);

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);

    return controlUI;
  }

  function startCountDown(game, $interval) {
    game.timeElapsed = "00:00:00";
    if (game.status == "STARTED") {
      var endTime = new Date(game.started_at).getTime() + (game.duration*60*1000);
      game.timeElapsed = new Date(endTime).getTime() - new Date().getTime() - 3600*1000;
      var watchTimeRemaining = $interval(function(){
        game.timeElapsed = new Date(endTime).getTime() - new Date().getTime() - 3600*1000;
        if(game.timeElapsed <= 0){
          $interval.cancel(watchTimeRemaining);
          game.status = "ENDED";
        }
      }, 1000);
    }
  }

  function stopCountDown(game) {
    game.timeElapsed = "00:00:00";
  }


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



  function startCountDown(game, $interval) {
    game.timeElapsed = "00:00:00";
    if (game.status == "STARTED") {
      var endTime = new Date(game.started_at).getTime() + (game.duration*60*1000);
      game.timeElapsed = new Date(endTime).getTime() - new Date().getTime() - 3600*1000;
      var watchTimeRemaining = $interval(function(){
        game.timeElapsed = new Date(endTime).getTime() - new Date().getTime() - 3600*1000;
        if(game.timeElapsed <= 0){
          $interval.cancel(watchTimeRemaining);
          game.status = "ENDED";
        }
      }, 1000);
    }
  }
});
