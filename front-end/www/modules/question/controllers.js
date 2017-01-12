angular.module('Question')

.controller('StartCtrl', function($scope, QuestionService) {

    $scope.$on("$ionicView.enter", function(event, data){
        initMap();

        QuestionService.getQuestions($scope);
        $scope.$on('getQuestionsOK', function (event, data) {
            console.log(data);
            $scope.questions = data;
        })

    });

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.6221174, lng: 7.0391009},
            zoom: 11
        });
    }

    $scope.createQuestion = function (question) {
        console.log(question);
        QuestionService.postQuestion($scope, question);
        $scope.$on('postQuestionOK', function (event, data) {
            console.log(data);
        })
    }
});
