angular.module('Question')

.factory('QuestionService', function($http, ServerEndpoint){
  return {

    getQuestions: function($scope) {
      return $http({
        url: ServerEndpoint.url + "/question",
        method: "GET"
    });
    },

    getQuestion: function($scope, id) {
      return $http({
        url: ServerEndpoint.url + "/question/" + id,
        method: "GET"
      });
    },

    postQuestion: function($scope, question) {
      return $http({
        url: ServerEndpoint.url + "/question",
        method: "POST",
        data: question
      });
    },

    deleteQuestion: function($scope, id) {
      return $http({
        url: ServerEndpoint.url + "/question/" + id,
        method: "DELETE"
      });
    }

  };
});
