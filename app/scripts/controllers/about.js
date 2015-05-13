'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the trunkApp
 */
angular.module('trunkApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
