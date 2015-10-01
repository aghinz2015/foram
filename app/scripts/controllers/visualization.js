'use strict';

app.controller('VisualizationCtrl', ['$scope', 'SimulationFactory', 'DatasetService', function ($scope, simulationFactory, datasetService) {
  var fetchGenotype = function() {
    var foram = datasetService.getFirstProduct();

    if (foram) {
      var genotype = foram.genotype;

      return {
        translationFactor: genotype.translation_factor.effective,
        growthFactor:      genotype.growth_factor.effective,
        beta:              genotype.deviation_angle.effective,
        phi:               genotype.rotation_angle.effective,
        numChambers:       7,
        initialRadius:     3
      };
    }
    else
      return null;
  };

  var simulation = simulationFactory($('#WebGL-output'));
  simulation.animate();

  $scope.data = {
    genotype: fetchGenotype()
  };

  $scope.simulate = function() {
    simulation.simulate($scope.data.genotype);
  };
}]);
