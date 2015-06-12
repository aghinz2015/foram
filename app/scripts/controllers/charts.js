'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */
app.controller('ChartsCtrl',['$scope','DatasetService', function ($scope,DatasetService) {
	console.log(DatasetService.getProducts());
  }]);
