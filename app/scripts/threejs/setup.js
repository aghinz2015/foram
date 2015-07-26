/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

/**
 * Setup the scene geometry
 * @param {Object} params
 * @constructor
 */
Viewer.Scene.Setup = function (params) {

  this.context = params.context;

  this.init();
};

Viewer.Scene.Setup.prototype = {

  /**
   * Initialize all of the THREE.JS framework
   */
  init: function () {
    console.log("Setups init");
    this.lights();
    this.createSphere();
  },

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

  createSphere: function(){
    console.log('Sphere created');
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    var sphere = new THREE.Mesh( geometry, material );
    this.context.model = sphere;
    this.context.scene.add(sphere);

  }
};
