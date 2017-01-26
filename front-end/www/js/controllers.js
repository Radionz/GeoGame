angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicHistory, $rootScope, $state) {
    $scope.signOut = function() {

        delete $rootScope.loggedInUser;
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('app.signIn');
    }
});
