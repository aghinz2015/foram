'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', 'DataURLService', 'FileSaver', 'Blob', function ($scope, configService, simulationFactory, genotypeService, dataURLService, FileSaver, Blob) {
  var canvas = document.getElementById('visualization');
  var simulation = simulationFactory(canvas);

  $scope.foram = genotypeService.fetchForamData();
  $scope.foram = $scope.foram || window._foram_genotype;

  $scope.morphology = {};

  configService.getConfig('visualization').then(function(response) {
    var defaults = response.data.defaults;

    $scope.material = defaults.material;

    simulation.simulate(
      $scope.foram.genotype,
      $scope.foram.chambersCount
    );

    recalculateMorphology();
  });


  $scope.simulate = function() {
    simulation.simulate($scope.foram.genotype, $scope.foram.chambersCount);
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
  };

  $scope.exportToCSV = function() {
    return simulation.exportToCSV();
  };

  $scope.takeScreenshot = function() {
    var dataURL = simulation.takeScreenshot();
    var data = dataURLService.dataURLToBlob(dataURL);

    FileSaver.saveAs(data, 'foram.jpeg');
  };

  $scope.fitTarget = function() {
    simulation.fitTarget();
  };

  var increaseChambersCount = function() {
    $scope.foram.chambersCount++;
  };

  var decreaseChambersCount = function() {
    if ($scope.foram.chambersCount > 1) {
      $scope.foram.chambersCount--
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
