/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

/**
 * @namespace  Renderer initialization.
 * @class Creates renderer for the scene.
 */
Viewer.Scene.Renderer = function (params) {
  this.renderer = null;
  this.context = params.context;
  this.init();
};

Viewer.Scene.Renderer.prototype = {

  /**
   * Initialize renderer.
   */
  init: function () {

    // create a render and set the size
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    this.renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
    this.renderer.shadowMapEnabled = true;
  },

  render: function(scene, camera) {
    this.renderer.render(scene,camera);
  }

};

