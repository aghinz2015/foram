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

  $scope.evolve = function() {
    simulation.evolve();
  };

  $scope.regress = function() {
    simulation.regress();
  };

  $scope.toggleChambers = function() {
    simulation.toggleChambers();
  };

  $scope.toggleCentroidsLine = function() {
    simulation.toggleCentroidsLine();
  };

  $scope.applyOpacity = function() {
    simulation.applyOpacity($scope.options.opacity);
  };
}]);
