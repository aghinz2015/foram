/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

/**
 * @namespace  Camera initialization.  Contains setup for both Perspective and Orthographic cameras.
 * @class Creates cameras for the scene.
 */
Viewer.Scene.Camera = function (params) {
  this.liveCamera = null;
  this.context = params.context;
  this.init();
};

Viewer.Scene.Camera.prototype = {

  /**
   * Initialize camera.
   */
  init: function () {
    this.liveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.liveCamera.position.x = 0;
    this.liveCamera.position.y = 12;
    this.liveCamera.position.z = 28;
    this.liveCamera.lookAt(new THREE.Vector3(0, 0, 0));

  }
};
