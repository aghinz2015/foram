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
  THREE.WebGLRenderer.call(this);
  this.init(params);
};


Viewer.Scene.Renderer.prototype = Object.create( THREE.WebGLRenderer.prototype );
Viewer.Scene.Renderer.constructor = Viewer.Scene.Renderer;

/**
 * initialize renderer
 * @param params
 */
Viewer.Scene.Renderer.prototype.init = function (params) {
    // create a render and set the size
    this.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    this.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
    this.shadowMapEnabled = true;
  };

/**
 *
 * @param width
 * @param height
 */
Viewer.Scene.Renderer.prototype.resize = function(width,height){
    this.setSize(width,height);
    this.setViewport(0, 0, width, height);
  };

