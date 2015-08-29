/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

Viewer.Scene.Setup = {
  /**
   * Functions preparing Setup object
   * @param params
   * @returns {Viewer.Scene.Setup}
   */
  init: function(params) {
    this.context = params.context;
    return this;
  },

  context: null,

  /**
   * Add light(s) to the scene
   */
  lights: function () {
    var ambiLight = new THREE.AmbientLight(0x141414);
    this.context.scene.add(ambiLight);

    var light = new THREE.DirectionalLight();
    light.position.set(0, 30, 20);
    this.context.scene.add(light);
  },

  createForam: function(genotype) {
    if (!genotype) return;

    var normalizedGenotype = {
      translationFactor: genotype.translation_factor.effective,
      growthFactor:      genotype.growth_factor.effective,
      beta:              genotype.deviation_angle.effective,
      phi:               genotype.rotation_angle.effective,
      initialRadius:     3
    };

    var foram = new Foram(normalizedGenotype);

    foram.buildChambers(7);

    this.context.model = foram;
    this.context.scene.add(foram);
  }
};
