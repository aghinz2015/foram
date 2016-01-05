'use strict';

app.controller('VisualizationCtrl', ['$scope', 'ConfigService', 'SimulationFactory', 'GenotypeService', 'DataURLService', 'FileSaver', 'Blob', function ($scope, configService, simulationFactory, genotypeService, dataURLService, FileSaver, Blob) {
  var canvas = document.getElementById('visualization');
  var simulation = simulationFactory(canvas);

  $scope.foram = genotypeService.fetchForamData();
  $scope.foram = window._foram || $scope.foram;

  $scope.morphology = {};

  $scope.toggles = {
    centoridsPath:    false,
    aperturesPath:    false,
    thicknessVectors: false,
    coloring:         false
  };

  configService.getConfig('visualization').then(function(response) {
    applyDefaults(response.data.defaults);
    $scope.simulate();
  });

  $scope.simulate = function() {
    simulation.simulate(
      $scope.foram.genotype,
      $scope.foram.chambersCount
    );

    recalculateMorphology();
    resetToggles();
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
    $scope.toggles.centroidsPath = !$scope.toggles.centroidsPath;
  };

  $scope.toggleAperturesPath = function() {
    simulation.toggleAperturesPath();
    $scope.toggles.aperturesPath = !$scope.toggles.aperturesPath;
  };

  $scope.toggleThicknessVectors = function() {
    simulation.toggleThicknessVectors();
    $scope.toggles.thicknessVectors = !$scope.toggles.thicknessVectors;
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

  $scope.recolour = function() {
    if ($scope.toggles.coloring) {
      colour();
    }
  };

  $scope.updateColorsList = function() {
    updateColorsList();
    $scope.recolour();
  };

  $scope.toggleColoring = function() {
    if ($scope.toggles.coloring) {
      simulation.decolour();
    } else {
      colour();
    }

    $scope.toggles.coloring = !$scope.toggles.coloring;
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

  var applyDefaults = function(defaults) {
    $scope.material = {
      opacity: defaults.material.opacity,
      colors:  []
    };

    var flatColors = defaults.material.colors;

    for (var i = 0; i < flatColors.length; i++) {
      $scope.material.colors.push(
        { value: flatColors[i] }
      );
    }

    $scope.material.colorsCount = flatColors.length;
  };

  var resetToggles = function() {
    var toggle;

    for (var toggle in $scope.toggles) {
      $scope.toggles[toggle] = false;
    }
  };

  var colour = function() {
    simulation.colour(fetchColors());
  };

  var fetchColors = function() {
    var colors = $scope.material.colors;
    var flatColors = [];

    for (var i = 0; i < colors.length; i++) {
      flatColors.push(colors[i].value);
    }

    return flatColors;
  };

  var updateColorsList = function() {
    var definedColorsCount  = $scope.material.colors.length;
    var selectedColorsCount = $scope.material.colorsCount;

    var colorsCountDiff = selectedColorsCount - definedColorsCount;

    if (colorsCountDiff >= 0) {
      for (var i = 0; i < colorsCountDiff; i++) {
        $scope.material.colors.push(
          { value: "#ffffff" }
        );
      }
    } else {
      $scope.material.colors.splice(
        selectedColorsCount,
        Math.abs(colorsCountDiff)
      );
    }
  };
}]);
