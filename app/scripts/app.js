'use strict';

/**
 * @ngdoc overview
 * @name trunkApp
 * @description
 * # trunkApp
 *
 * Main module of the application.
 */
var app = angular.module('trunkApp', ['ngRoute', 'highcharts-ng', 'colorpicker.module','ngDialog']);

  // basic routing config
  app.config(function ($routeProvider) {
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
        templateUrl: 'views/databases.html',
        controller: 'DatabasesCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/visualisation', {
        templateUrl: 'views/visualisation.html',
        controller: 'VisualisationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
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
  });

  // mock service to set and get data between controllers
  // #TODO in PROD version this is to be removed or replaced with better solution (factory with API methods?)
  app.service('DatasetService', function() {
    var productList = [];

    this.putProducts = function(newDataset) {
      productList = newDataset;
    };

    this.getProducts = function(){
      return productList;
    };

  });

app.constant('appConfig',{
  apiForamsUrl:'http://localhost:3000/forams',
  apiGenerationsUrl:'http://localhost:3000/generations'
});

var Viewer = {
  'Scene': null
};

