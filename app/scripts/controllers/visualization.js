'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', function ($scope, configService, simulationFactory, genotypeService) {
  var simulation = simulationFactory($('#visualization'));
  simulation.animate();

  $scope.genotype = genotypeService.fetchGenotype();

  configService.getConfig('visualization').then(function(response) {
    $scope.options = response.data.defaults;
  });

  $scope.simulate = function() {
    simulation.simulate($scope.genotype, $scope.options);
  };
}]);
