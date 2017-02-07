angular.module('Chat')

.controller('ChatCtrl', function($scope, GameService, $rootScope, $interval, $timeout, $ionicScrollDelegate, UserService, ChatService) {

    var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
      alternate = !alternate;

      var date = new Date();
      date = date.toLocaleTimeString().replace(/:\d+ /, ' ');

      ChatService.postMessage({
        userFrom: $scope.myId,
        text: $scope.data.message,
        time: 1486485109
      }).success(function(message) {
        $scope.messages.push(message);
        $scope.data = {};
        $ionicScrollDelegate.scrollBottom(true);
      }).error( function(err, status) {

      });

      $ionicScrollDelegate.scrollBottom(true);
    };


    $scope.inputUp = function() {
      if (isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    };

    $scope.inputDown = function() {
      if (isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = $rootScope.loggedInUser._id;
    $scope.messages = [];
    ChatService.getAllMessages()
      .success(function(messages) {
        messages.forEach(function(message){
          $scope.messages.push(message);
        });
        $ionicScrollDelegate.scrollBottom(true);
      });
});
