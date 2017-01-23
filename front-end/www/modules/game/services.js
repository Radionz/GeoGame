angular.module('Game')

.factory('GameService', function($http, ServerEndpoint){
  return {

    getGames: function() {
      return $http({
        url: ServerEndpoint.url + "/game",
        method: "GET"
      });
    },

    getGame: function(id) {
      return $http({
        url: ServerEndpoint.url + "/game/"+id,
        method: "GET"
      });
    },

    postGame: function(game) {
      return $http({
        url: ServerEndpoint.url + "/game",
        method: "POST",
        data: game
      });
    },

    putGame: function(game) {
      return $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      });
    },

    startGame: function(game) {
      game.status = "STARTED";
      game.started_at = (+ new Date());
      return $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      });
    },

    stopGame: function(game) {
      game.status = "NOT_STARTED";
      return $http({
        url: ServerEndpoint.url + "/game/"+game._id,
        method: "PUT",
        data: game
      });
    },

    deleteGame: function(id) {
      return $http({
        url: ServerEndpoint.url + "/game/" + id,
        method: "DELETE"
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

function startCountDown(game, $interval) {
  game.timeElapsed = "00:00:00";
  if (game.status == "STARTED") {
    var endTime = (+ new Date(game.started_at)) + (game.duration*60*1000);
    var watchTimeRemaining = $interval(function(){
      game.timeElapsed = new Date(endTime) - new Date();
      if(game.timeElapsed<=0){
        $interval.cancel(watchTimeRemaining);
        game.status = "ENDED";
      }
    }, 1000);
  }
}

function stopCountDown(game) {
  game.timeElapsed = "00:00:00";
}
