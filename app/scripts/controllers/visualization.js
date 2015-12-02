'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', function ($scope, configService, simulationFactory, genotypeService) {
  var simulation = simulationFactory(document.getElementById('visualization'));

  configService.getConfig('visualization').then(function(response) {
    $scope.genotype = genotypeService.fetchGenotype();
    $scope.options  = response.data.defaults;

    simulation.simulate($scope.genotype, $scope.options);
    simulation.animate();
  });

  $scope.simulate = function() {
    simulation.simulate($scope.genotype, $scope.options.numChambers);
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
