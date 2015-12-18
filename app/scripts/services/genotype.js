'use strict';

app.service('GenotypeService', ['DatasetService', function(datasetService) {
  this.fetchForamData = function() {
    var foram = datasetService.getFirstProduct();

    if (!foram) return;

    return {
      genotype: normalizeGenotype(foram.genotype),
      chambersCount: foram.chambers_count
    };
  };

  var normalizeGenotype = function(genotype) {
    return {
      beta:                genotype.deviation_angle.effective,
      phi:                 genotype.rotation_angle.effective,
      growthFactor:        genotype.growth_factor.effective,
      translationFactor:   genotype.translation_factor.effective,
      wallThicknessFactor: genotype.wall_thickness_factor.effective
    };
  };
}]);
