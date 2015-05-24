'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trunkApp
 */
angular.module('trunkApp')
  .controller('MainCtrl',['$scope','$http', function ($scope,$http) {
    $http.get('http://foram-api.herokuapp.com/forams').success(function(data, status, headers, config) {
      $scope.forams = data;
      $scope.status = status;
    });
  }]);
