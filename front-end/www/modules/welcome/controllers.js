angular.module('Welcome')

.controller('WelcomeCtrl', function($scope, GameService, $rootScope, $interval) {

    $scope.$on("$ionicView.enter", function(event, data){
        GameService.getGames($scope).then(function(response) {
            var games = response.data;

            //If the game is started we start the count down of play time remaining
            angular.forEach(games, function(game) {
                startCountDown(game, $interval);
            });

            $scope.games = games;
        });
    });

    $scope.alreadyIn = function (game) {
      var alreadyIn = false;
      angular.forEach(game.scoreBoard, function(scoreBoardEntry) {
        if (scoreBoardEntry.userId == $rootScope.loggedInUser._id) {
          alreadyIn = true;
        }
      });
      return alreadyIn;
    }

    $scope.isFull = function (game) {
      return game.scoreBoard.length >= game.playerNb;
    }
})

.controller('SignInCtrl', function($scope, $rootScope, $state, $ionicHistory, $ionicPopup, UserService) {

    $scope.$on("$ionicView.enter", function(event, data){
        initSkewTitle();

        if (typeof(Storage) !== "undefined" && localStorage.getItem("userId") !== null) {
            UserService.getUser(localStorage.getItem("userId")).then(function(response) {
                var user = response.data;
                delete user.password;
                $rootScope.loggedInUser = user;

                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true
                });

                $state.go('app.welcome');
            });
        }

        $scope.user = {};
    });

    $scope.signIn = function (user) {
        UserService.getUserByEmail(user.username).then(function(response) {
            var user = response.data;
            if (user == null) {
                $ionicPopup.alert({
                    title: "Username or password invalid",
                    template: "Please check your credentials"
                });
            }else {
                delete user.password;
                $rootScope.loggedInUser = user;

                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("userId", $rootScope.loggedInUser._id);
                }

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go('app.welcome');
            }
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
