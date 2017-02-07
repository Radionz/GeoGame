angular.module('Chat')

.controller('ChatCtrl', function($scope, GameService, $rootScope, $interval, $timeout
  , $ionicScrollDelegate, UserService, ChatService, ServerEndpoint) {

    var socket = io.connect(ServerEndpoint.url);
    var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
      alternate = !alternate;

      var date = new Date();
      date = date.toLocaleTimeString().replace(/:\d+ /, ' ');

      socket.emit('message', {
        userFrom: $scope.myId,
        text: $scope.data.message,
        time: 1486485109
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
    $scope.messages = [];
    $ionicScrollDelegate.scrollBottom(true);
    if (typeof(Storage) !== "undefined" && localStorage.getItem("userId") !== null) {
      $scope.myId = localStorage.getItem("userId");
    }


    socket.on('message', function(message) {
      $scope.messages.push(message);
      $scope.data = {};
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(true);
    });

    socket.on('messages', function(messages) {
      messages.forEach(function(message){
        $scope.messages.push(message);
      });
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(false);
    });
});
