'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trunkApp
 */
angular.module('trunkApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
