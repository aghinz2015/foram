'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', 'FileSaver', 'Blob', function ($scope, configService, simulationFactory, genotypeService, FileSaver, Blob) {
  var simulation = simulationFactory(document.getElementById('visualization'));

  $scope.genotype = genotypeService.fetchGenotype();
  $scope.morphology = {};

  configService.getConfig('visualization').then(function(response) {
    $scope.options  = response.data.defaults;

    simulation.simulate($scope.genotype, $scope.options.numChambers);

    recalculateMorphology();
  });

  $scope.simulate = function() {
    simulation.simulate($scope.genotype, $scope.options.numChambers);
    recalculateMorphology();
  };

  $scope.evolve = function() {
    simulation.evolve();
    rerecalculateMorphology();
  };

  $scope.regress = function() {
    simulation.regress();
    recalculateMorphology();
  };

  $scope.toggleChambers = function() {
    simulation.toggleChambers();
  };

  $scope.toggleCentroidsPath = function() {
    simulation.toggleCentroidsPath();
  };

  $scope.toggleAperturesPath = function() {
    simulation.toggleAperturesPath();
  };

  $scope.toggleThicknessVectors = function() {
    simulation.toggleThicknessVectors();
  };

  $scope.applyOpacity = function() {
    simulation.applyOpacity($scope.options.opacity);
  };

  $scope.exportToOBJ = function() {
    var obj  = simulation.exportToOBJ();
    var data = new Blob([obj], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(data, 'foram.obj');
  }

  var recalculateMorphology = function() {
    $scope.morphology = {
      volume:      simulation.calculateVolume(),
      surface:     simulation.calculateSurfaceArea(),
      shapeFactor: simulation.calculateShapeFactor()
    }
  }
}]);
