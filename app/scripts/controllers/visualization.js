'use strict';

app.controller('VisualizationCtrl', ['$scope', 'SimulationFactory', 'GenotypeService', function ($scope, simulationFactory, genotypeService) {
  var simulation = simulationFactory($('#WebGL-output'));
  simulation.animate();

  $scope.data = {
    genotype: genotypeService.fetchGenotype(),
  };

  $scope.simulate = function() {
    simulation.simulate($scope.data.genotype);
  };
}]);
