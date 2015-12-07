'use strict';

/**
 * @ngdoc overview
 * @name trunkApp
 * @description
 * # trunkApp
 *
 * Main module of the application.
 */

var app = angular.module('trunkApp', ['ngRoute', 'mm.foundation', 'highcharts-ng', 'colorpicker.module', 'ngCookies' ,'config']);

  // basic routing config
  app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/charts', {
        templateUrl: 'views/charts.html',
        controller: 'ChartsCtrl'
      })
      .when('/table', {
        templateUrl: 'views/foram-table.html',
        controller: 'TableCtrl'
      })
      .when('/databases', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/visualization', {
        templateUrl: 'views/visualization.html',
        controller: 'VisualizationCtrl'
      })
      .when('/sign', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('APIInterceptor');
  })
    .filter('forceInt', function(){
    return function(input) {
      return parseInt(input, 10);
    };
  })
    .filter('forceFloat', function(){
    return function(input){
      return parseFloat(input);
    }
  })
    .filter('checkName',function(){
      return function(input,mappings){
        return mappings[input] ? mappings[input] : input;
      }
    });

  app.run(function($rootScope, $location, $cookies, $http) {
    // keep user logged in after page refresh
    try {
      $rootScope.globals = $cookies.getObject('globals') || {};
    }
    catch (e) {
      $rootScope.globals = {};
    }
    if($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Token token="' + $rootScope.globals.currentUser.token + '", email="' + $rootScope.globals.currentUser.email + '"';
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/sign', '/register']) === -1;
      var loggedIn = $rootScope.globals.currentUser;
      if(restrictedPage && !loggedIn) {
        $location.path('/sign');
      }
    })
  });

  app.service('APIInterceptor', ['$location', function($location) {
    return {
      responseError: function(response) {
        // redirect to login page if api returns unauthorized
        if (response.status === 401) {
          $location.path('/login');
        }
        return response;
      }
    }
  }]);

  app.service('DatasetService', function() {
    var productList = [];

    this.putProducts = function(newDataset) {
      productList = newDataset;
    };

    this.getProducts = function(){
      return productList;
    };

    this.getFirstProduct = function() {
      return productList[0];
    };
  });

  var Viewer = {
    'Scene': null
  };


app.directive('autocomplete', function() {

  return {

    restrict: 'A',
    link: function( $scope, el, attr ) {

      el.bind('change', function(e) {

        e.preventDefault();

      })
    }
  }

});
