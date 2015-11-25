'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', 'FileSaver', 'Blob', function ($scope, configService, simulationFactory, genotypeService, FileSaver, Blob) {
  var canvas = document.getElementById('visualization');
  var simulation = simulationFactory(canvas);

  $scope.genotype = genotypeService.fetchGenotype();
  $scope.genotype = $scope.genotype || window._foram_genotype;
  $scope.morphology = {};

  configService.getConfig('visualization').then(function(response) {
    var defaults = response.data.defaults;

    $scope.structureAnalyzer = defaults.structureAnalyzer;
    if (window._foram_chambers) {
      $scope.structureAnalyzer.numChambers = window._foram_chambers;
    }
    $scope.material = defaults.material;

    simulation.simulate($scope.genotype, $scope.structureAnalyzer.numChambers);

    recalculateMorphology();
  });


  $scope.simulate = function() {
    simulation.simulate($scope.genotype, $scope.structureAnalyzer.numChambers);
    recalculateMorphology();
  };

  $scope.evolve = function() {
    simulation.evolve();
    increaseChambersCount();
    recalculateMorphology();
  };

  $scope.regress = function() {
    simulation.regress();
    decreaseChambersCount();
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
    simulation.applyOpacity($scope.material.opacity);
  };

  $scope.exportToOBJ = function() {
    var obj  = simulation.exportToOBJ();
    var data = new Blob([obj], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(data, 'foram.obj');
  }

  $scope.exportToCSV = function() {
    return simulation.exportToCSV();
  }

  var increaseChambersCount = function() {
    $scope.structureAnalyzer.numChambers++;
  };

  var decreaseChambersCount = function() {
    if ($scope.structureAnalyzer.numChambers > 1) {
      $scope.structureAnalyzer.numChambers--
    }
  };

  var recalculateMorphology = function() {
    $scope.morphology = {
      volume:      simulation.calculateVolume(),
      surface:     simulation.calculateSurfaceArea(),
      shapeFactor: simulation.calculateShapeFactor()
    }
  };
}]);
