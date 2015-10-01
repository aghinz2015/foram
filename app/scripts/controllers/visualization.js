'use strict';

app.controller('VisualizationCtrl', ['$scope', 'SimulationFactory', 'GenotypeService', function ($scope, simulationFactory, genotypeService) {
  var simulation = simulationFactory($('#visualization'));
  simulation.animate();

  $scope.data = {
    genotype: genotypeService.fetchGenotype(),
  };

  $scope.simulate = function() {
    simulation.simulate($scope.data.genotype);
  };
}]);
