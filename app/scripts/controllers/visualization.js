'use strict';

app.controller('VisualizationCtrl', ['$scope', 'SimulationFactory', 'GenotypeService', function ($scope, simulationFactory, genotypeService) {
  var simulation = simulationFactory($('#visualization'));
  simulation.animate();

  $scope.data = {
    genotype: genotypeService.fetchGenotype(),
    options:  { numChambers: 7 }
  };

  $scope.simulate = function() {
    simulation.simulate($scope.data.genotype, $scope.data.options);
  };
}]);
