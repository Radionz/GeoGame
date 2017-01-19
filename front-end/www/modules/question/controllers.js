angular.module('Question')

.controller('StartCtrl', function($scope, QuestionService) {

  $scope.gameSettings = {};
  $scope.gameSettings.duration = 90;
  $scope.gameSettings.playerNb = 5;

  // $scope.computeHourAndMinutes = function () {
  //   var hours = Math.floor( $scope.gameSettings.duration / 60),
  //   minutes = $scope.gameSettings.duration % 60;
  //
  //   $scope.gameSettings.hours = hours;
  //   $scope.gameSettings.minutes = minutes;
  // }
  
  $scope.question = {};
  $scope.question.loc = {};
  $scope.question.loc.coordinates = [];

  var image = {
    url: 'img/question_marker.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 8)
  };

  $scope.$on("$ionicView.enter", function(event, data){
    initMap();

    QuestionService.getQuestions($scope);
    $scope.$on('getQuestionsOK', function (event, data) {
      $scope.questions = data;
      angular.forEach(data, function(value, key) {
        addQuestionToMap(value);
      });
    })

  });

  $scope.createQuestion = function (question) {
    console.log(question);
    $scope.questions.push(question);
    QuestionService.postQuestion($scope, question);
    $scope.$on('postQuestionOK', function (event, data) {
      console.log(data);
      $scope.questions.push(data);
      addQuestionToMap(data);
    })
  }

  function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.6221174, lng: 7.0391009},
      zoom: 14
    });
  }

  function addQuestionToMap(question) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(question.loc.coordinates[1], question.loc.coordinates[0]),
      map: $scope.map,
      icon: image,
      label: 15,
      title: question.name,
      animation: google.maps.Animation.DROP
    });

    console.log();
  }
});
