angular.module('Chat')


.controller('ChatCtrl', function($scope, GameService, $rootScope, $interval, $timeout, $ionicScrollDelegate,
    $ionicHistory, UserService, ChatRoomService, ServerEndpoint) {

    ChatRoomService.getAllChatRooms()
      .then(function(data) {
        $scope.chatrooms = data.data;
      });

})


.controller('ChatRoomCtrl', function($scope, GameService, $rootScope, $interval, $timeout, $ionicScrollDelegate,
   $stateParams,$ionicNavBarDelegate,$ionicHistory, UserService, ChatRoomService, ServerEndpoint) {



  $scope.$on('$ionicView.enter', function() {
    // Code you want executed every time view is opened
    console.log('Opened!')
    $ionicHistory.nextViewOptions({
     disableAnimate: true,
     disableBack: true
    });



    if ($stateParams.id == "Global") {
     console.log('Global!')
    }

    var socket = io.connect(ServerEndpoint.url);
    var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
      alternate = !alternate;

      var date = new Date();
      date = date.toLocaleTimeString().replace(/:\d+ /, ' ');

      // socket.emit('message', {
      //   userFrom: $scope.myId,
      //   userFromName: $rootScope.loggedInUser.name,
      //   text: $scope.data.message,
      //   time: new Date()
      // });

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

      // Get id for wished room
      ChatRoomService.getChatRoomFromName("Global")
        .then(function(chats) {

          if (chats.data.length === 0) {
            console.log("No room to join founded");
            return;
          }

          // Create request for joining room
          var req = {
            chatId : chats.data[0]._id,
            userId : $scope.myId
          }
          socket.emit('newclient', req);
        })
    }

    socket.on('users', function(users) {
      var unique = users.filter(function(elem, index, self) {
          return index != self.indexOf(elem);
      });
      $scope.users = unique;
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(false);
    });

    // socket.on('message', function(message) {
    //   $scope.messages.push(message);
    //   $scope.data = {};
    //   $scope.$apply();
    //   $ionicScrollDelegate.scrollBottom(true);
    // });

    socket.on('messages', function(messages) {
      messages.forEach(function(message){
        if (((new Date) - new Date(message.time)) >  24 * 60 * 60 * 1000) {
          message.isOlderThanOneDay = true;
        }
        $scope.messages.push(message);
      });
      $scope.$apply();
      $ionicScrollDelegate.scrollBottom(false);
    });

  })
});
