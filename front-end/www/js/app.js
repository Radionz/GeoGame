// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Welcome', []);
angular.module('Game', []);
angular.module('Question', []);
angular.module('starter', ['ionic', 'starter.controllers', 'Welcome', 'Game', 'Question'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.constant('ServerEndpoint', {
        url: 'http://localhost:8080'
        //url: 'http://server_url:8080'
    })

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.welcome', {
        url: '/welcome',
        views: {
            'menuContent': {
                templateUrl: 'modules/welcome/views/welcome.html',
                controller: 'WelcomeCtrl'
            }
        }
    })
    .state('app.game', {
        url: '/game',
        views: {
            'menuContent': {
                templateUrl: 'modules/game/views/game.html',
                controller: 'GameCtrl'
            }
        }
    })
    .state('app.question', {
        url: '/question',
        views: {
            'menuContent': {
                templateUrl: 'modules/question/views/question.html',
                controller: 'QuestionCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/welcome');
});
