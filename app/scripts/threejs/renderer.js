/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

/**
 * Setup the scene renderer
 * @param {Object} params
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
    this.domElement = this.renderer.domElement;
  },

  /**
   * Render current scene and camera.
   */
  render: function(scene, camera) {
    this.renderer.render(scene,camera);
  },

  /**
   * Resize current viewport and set size.
   */
  resize: function(width,height){
    this.renderer.setSize(width,height);
    this.renderer.setViewport(0, 0, width, height);
  }
};

