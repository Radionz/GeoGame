angular.module('Game')

.factory('GameService', function($http, ServerEndpoint){
  return {
    getGames: function($scope) {
      $http({
        url: ServerEndpoint.url + "/game",
        method: "GET"
      }).success(function(data) {
        $scope.$emit('getGamesOK', data);
      })
      .error(function(error, status){
        console.log('ERR | getGames - Problème de communication avec le serveur.');
        $scope.$emit('getGamesKO', error);
      });
    },
    getGame: function($scope, id) {
      $http({
        url: ServerEndpoint.url + "/game/"+id,
        method: "GET"
      }).success(function(data) {
        $scope.$emit('getGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | getGame - Problème de communication avec le serveur.');
        $scope.$emit('getGameKO', error);
      });
    },
    postGame: function($scope, game) {
      $http({
        url: ServerEndpoint.url + "/game",
        method: "POST",
        data: game
      }).success(function(data) {
        $scope.$emit('postGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | postGame - Problème de communication avec le serveur.');
        $scope.$emit('postGameKO', error);
      });
    },
    putGame: function($scope, game) {
      $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      }).success(function(data) {
        $scope.$emit('putGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | putGame - Problème de communication avec le serveur.');
        $scope.$emit('putGameKO', error);
      });
    },
    startGame: function($scope, game) {
      game.status = "STARTED";
      game.started_at = (+ new Date());
      $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      }).success(function(data) {
        $scope.$emit('startGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | startGame - Problème de communication avec le serveur.');
        $scope.$emit('startGameKO', error);
      });
    },
    stopGame: function($scope, game) {
      game.status = "NOT_STARTED";
      GameService.stopGame($scope, game);
      $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      }).success(function(data) {
        $scope.$emit('stopGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | stopGame - Problème de communication avec le serveur.');
        $scope.$emit('stopGameKO', error);
      });
    },
    deleteGame: function($scope, id) {
      $http({
        url: ServerEndpoint.url + "/game/" + id,
        method: "DELETE"
      }).success(function(data) {
        $scope.$emit('deleteGameOK', data);
      })
      .error(function(error, status){
        console.log('ERR | deleteGame - Problème de communication avec le serveur.');
        $scope.$emit('deleteGameKO', error);
      });
    }
  };
});

// Utils function
function addYourLocationButton(map) {
  var controlDiv = document.createElement('div');

  var controlUI = document.createElement('button');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = 'none';
  controlUI.style.outline = 'none';
  controlUI.style.width = '28px';
  controlUI.style.height = '28px';
  controlUI.style.borderRadius = '2px';
  controlUI.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginRight = '10px';
  controlUI.style.padding = '0px';
  controlUI.title = 'Your Location';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.position = 'absolute';
  controlText.style.top = '6px';
  controlText.style.left = '6px';
  controlText.style.width = '18px';
  controlText.style.height = '18px';
  controlText.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-cookieless-v2-2x.png)';
  controlText.style.backgroundSize = '180px 18px';
  controlText.style.backgroundPosition = '0px 0px';
  controlText.style.backgroundRepeat = 'no-repeat';
  controlText.id = 'you_location_img';
  controlUI.appendChild(controlText);

  google.maps.event.addListener(map, 'dragend', function() {
    $('#you_location_img').css('background-position', '0px 0px');
  });

  controlUI.addEventListener('click', function() {
    var imgX = '0';
    var animationInterval = setInterval(function(){
      if(imgX == '-18') imgX = '0';
      else imgX = '-18';
      $('#you_location_img').css('background-position', imgX+'px 0px');
    }, 500);
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
        clearInterval(animationInterval);
        $('#you_location_img').css('background-position', '-144px 0px');
      });
    }
    else{
      clearInterval(animationInterval);
      $('#you_location_img').css('background-position', '0px 0px');
    }
  });

  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function addViewScoreBoardButton(map) {
  var controlDiv = document.createElement('div');
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Show ScoreBoard';
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function() {
    console.log("clicked");
  });

  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
}
