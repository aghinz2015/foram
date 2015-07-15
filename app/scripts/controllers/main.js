'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trunkApp
 */
app.controller('MainCtrl',['$scope','$http','$q', function ($scope,$http,$q) {
  $scope.forams = [];
  $http.get('https://foram-api.herokuapp.com/forams').success(function(data, status, headers, config) {
      $scope.forams = data.forams;

      $scope.status = status;
      $scope.headers = Object.keys($scope.forams[0]);

    });
  }]);
