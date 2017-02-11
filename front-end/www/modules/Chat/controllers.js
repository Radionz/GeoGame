angular.module('Chat')


.controller('ChatCtrl', function($scope, GameService, $rootScope, $interval, $timeout, $ionicScrollDelegate,
    $ionicHistory, UserService, ChatRoomService, ServerEndpoint) {

    if (typeof(Storage) !== "undefined" && localStorage.getItem("userId") !== null) {
      $scope.myId = localStorage.getItem("userId");
    }

    ChatRoomService.getAllChatRooms()
    .then(function(data) {
      $scope.chatrooms = data.data;
    });

})


.controller('ChatRoomCtrl', function($scope, GameService, $rootScope, $interval, $timeout, $ionicScrollDelegate,
   $stateParams,$ionicNavBarDelegate,$ionicHistory, UserService, ChatRoomService, ServerEndpoint) {

  var chatId;



  $scope.$on('$ionicView.enter', function() {


    // Code you want executed every time view is opened
    console.log('Opened! ' + $stateParams.id)


    $ionicHistory.nextViewOptions({
     disableAnimate: true,
     disableBack: true
    });

    if ($stateParams.id == "Global") {
     console.log('Global!')
    }

    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {

      var date = new Date();
      date = date.toLocaleTimeString().replace(/:\d+ /, ' ');

      $scope.socket.emit('message', {
        userFrom: $scope.myId,
        userFromName: $rootScope.loggedInUser.name,
        text: $scope.data.message,
        time: new Date()
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



    // Get id for wished room
    ChatRoomService.getChatRoomFromName($stateParams.id)
    .then(function(chats) {

      if (chats.data.length === 0) {
        console.log("No room to join founded");
        return;
      }

      chatId = chats.data[0]._id;
      // Create request for joining room
      var req = {
        chatId : chatId,
        userId : $scope.myId
      }
      $rootScope.socket.emit('newclient', req);

    });

    $rootScope.socket.on('users', function(users) {
      var unique = users.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
      $scope.users = unique;
      $scope.$apply();
      $('.profilePicture').initial();
      $ionicScrollDelegate.scrollBottom(false);
    });

    $rootScope.socket.on('message', function(message) {
      $scope.messages.push(message);
      $scope.data = {};
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(true);
    });

    $rootScope.socket.on('messages', function(messages) {
      messages.forEach(function(message){
        if (((new Date) - new Date(message.time)) >  24 * 60 * 60 * 1000) {
          message.isOlderThanOneDay = true;
        }
        $scope.messages.push(message);
      });
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(false);
    });

  });

  $scope.$on('$ionicView.leave', function() {

    var req = {
      chatId : chatId,
      userId : $scope.myId
    }

    $rootScope.socket.emit('leaveChatroom', req);
  });

});
