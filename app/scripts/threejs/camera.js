/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

Viewer.Scene = Viewer.Scene || {};

/**
 * Create cameras holder for our view
 * @param params
 * @constructor
 */
Viewer.Scene.Camera = function (params) {
  THREE.PerspectiveCamera.call(this);

  this.init(params);

};

Viewer.Scene.Camera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
Viewer.Scene.Camera.constructor = Viewer.Scene.Camera;

/**
 *
 * @param params
 */
Viewer.Scene.Camera.prototype.init = function (params) {
 //this.liveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  this.fov = 45;
  this.aspect = window.innerWidth / window.innerHeight;
  this.near = 0.1;
  this.far = 1000;
  this.position.set(0, 12, 28);
  this.lookAt(new THREE.Vector3(0, 0, 0));
  this.updateProjectionMatrix();
};

/**
 *
 * @param width
 * @param height
 */
Viewer.Scene.Camera.prototype.resize = function(width,height) {
  this.aspect = width/height;
  this.updateProjectionMatrix();
};
