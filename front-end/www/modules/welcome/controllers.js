angular.module('Welcome')

.controller('WelcomeCtrl', function($scope, GameService) {

    $scope.$on("$ionicView.enter", function(event, data){

        GameService.getGames($scope).then(function(response) {
            var games = response.data;
            $scope.games = games;
        });

    });

})

.controller('SignInCtrl', function($scope, $ionicPopup, UserService) {

    $scope.$on("$ionicView.enter", function(event, data){
        $scope.user = {};
    });

    $scope.signIn = function (user) {
        console.log(user);

        $ionicPopup.alert({
            title: "Username or password invalid",
            template: "Please check your credentials"
        });
    };

})

.controller('SignUpCtrl', function($scope) {

    $scope.$on("$ionicView.enter", function(event, data){

    });

})

.controller('ForgotPasswordCtrl', function($scope) {

    $scope.$on("$ionicView.enter", function(event, data){

    });

});
