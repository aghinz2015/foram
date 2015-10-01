'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:VisualizationCtrl
 * @description
 * # VisualizationCtrl
 * Controller of the trunkApp
 */
app.controller('VisualizationCtrl', ['$scope', 'ViewerFactory', 'DatasetService', function ($scope, ViewerFactory, DatasetService) {

  var fetchGenotype = function() {
    var foram = DatasetService.getProducts()[0];

    if (foram) {
      return foram.genotype;
    } else {
      return null;
    }
  };

  // initialize our ViewerFactory responsible for 3D visualization
  var viewer = new ViewerFactory({
    containerId: '#WebGL-output',
    genotype:    fetchGenotype()
  });

  $scope.evolve = function() {
    viewer.evolve();
  };

  $scope.regress = function() {
    viewer.regress();
  };
}]);
