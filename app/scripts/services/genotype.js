'use strict';

app.service('GenotypeService', ['DatasetService', function(datasetService) {
  this.normalizeGenotype = function(genotype) {
    return {
      beta:                genotype.deviation_angle.effective,
      phi:                 genotype.rotation_angle.effective,
      growthFactor:        genotype.growth_factor.effective,
      translationFactor:   genotype.translation_factor.effective,
      wallThicknessFactor: genotype.wall_thickness_factor.effective
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
