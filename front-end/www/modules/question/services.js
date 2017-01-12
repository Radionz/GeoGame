angular.module('Question')

.factory('QuestionService', function($http, ServerEndpoint){
    return {

        getQuestions: function($scope) {
            $http({
                url: ServerEndpoint.url + "/question",
                method: "GET"
            }).success(function(data) {
                $scope.$emit('getQuestionsOK', data);
            })
            .error(function(error, status){
                console.log('ERR | getQuestions - Problème de communication avec le serveur.');
                $scope.$emit('getQuestionsKO', error);
            });
        },
        postQuestion: function($scope, question) {
            $http({
                url: ServerEndpoint.url + "/question",
                method: "POST",
                data: question
            }).success(function(data) {
                $scope.$emit('postQuestionOK', data);
            })
            .error(function(error, status){
                console.log('ERR | postQuestion - Problème de communication avec le serveur.');
                $scope.$emit('postQuestionKO', error);
            });
        }

    };
});
