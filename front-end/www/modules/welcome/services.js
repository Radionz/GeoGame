angular.module('Welcome')

.factory('UserService', function($http, ServerEndpoint){
    return {

        getUsers: function($scope) {
            return $http({
                url: ServerEndpoint.url + "/user",
                method: "GET"
            });
        },

        getUser: function($scope, id) {
            return $http({
                url: ServerEndpoint.url + "/user/" + id,
                method: "GET"
            });
        },

        getUserByEmail: function($scope, email) {
            return $http({
                url: ServerEndpoint.url + "/user/email/" + email,
                method: "GET"
            });
        },

        postUser: function($scope, user) {
            return $http({
                url: ServerEndpoint.url + "/user",
                method: "POST",
                data: user
            });
        },

        deleteUser: function($scope, id) {
            return $http({
                url: ServerEndpoint.url + "/user/" + id,
                method: "DELETE"
            });
        }

    };
});
