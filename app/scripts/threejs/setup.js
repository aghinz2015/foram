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

  /**
   * Create objects #TODO This object is a demo object just to see something
   */
  createSphere: function(){
    console.log('Sphere created');
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    var sphere = new THREE.Mesh( geometry, material );
    this.context.scene.add(sphere);
  }
};
