'use strict';

app.service('GenotypeService', ['DatasetService', function(datasetService) {
  var normalizeGenotype = function(genotype) {
    return {
      translationFactor: genotype.translation_factor.effective,
      growthFactor:      genotype.growth_factor.effective,
      beta:              genotype.deviation_angle.effective,
      phi:               genotype.rotation_angle.effective,
    };
  };

  this.fetchGenotype = function() {
    var foram = datasetService.getFirstProduct();

    if (foram)
      return normalizeGenotype(foram.genotype);
    else
      return null;
  };
}]);
