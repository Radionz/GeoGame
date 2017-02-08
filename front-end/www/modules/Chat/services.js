angular.module('Chat')

.factory('ChatService', function($http, ServerEndpoint){
  return {

    getAllMessages: function() {
      return $http({
        url: ServerEndpoint.url + "/chat",
        method: "GET"
    });
    },

    getAllPersonalMessages: function(idUser) {
      return $http({
        url: ServerEndpoint.url + "/chat/user/" + UserService.getUser(idUser),
        method: "GET"
    });
    },

    getMessage: function(id) {
      return $http({
        url: ServerEndpoint.url + "/chat/" + id,
        method: "GET"
      });
    },

    postMessage: function(message) {
      return $http({
        url: ServerEndpoint.url + "/chat",
        method: "POST",
        data: message
      });
    },

    deleteMessage: function(id) {
      return $http({
        url: ServerEndpoint.url + "/message/" + id,
        method: "DELETE"
      });
    }

  };
});
