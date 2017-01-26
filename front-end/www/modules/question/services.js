angular.module('Question')

.factory('QuestionService', function($http, ServerEndpoint){
  return {

    getQuestions: function() {
      return $http({
        url: ServerEndpoint.url + "/question",
        method: "GET"
    });
    },

    getQuestion: function(id) {
      return $http({
        url: ServerEndpoint.url + "/question/" + id,
        method: "GET"
      });
    },

    postQuestion: function(question) {
      return $http({
        url: ServerEndpoint.url + "/question",
        method: "POST",
        data: question
      });
    },

    deleteQuestion: function(id) {
      return $http({
        url: ServerEndpoint.url + "/question/" + id,
        method: "DELETE"
      });
    }

  };
});
