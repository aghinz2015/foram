/**
 * Created by ezimonczyk on 20/07/15.
 */
'use strict';

app.factory('ViewerFactory',function(){

  var SceneViewer = function(params){
    this.viewer = new Viewer.Scene(params);
    this.model = this.viewer.model;
    this.viewer.animate();
  };

  SceneViewer.prototype.rotate = function(x, y, z){
    this.model.rotation.set(
      THREE.Math.degToRad(x),
      THREE.Math.degToRad(y),
      THREE.Math.degToRad(z)
    );
  };

  SceneViewer.prototype.translate = function(x, y, z){
    this.model.position.set(x, y, z)
  };

  SceneViewer.prototype.scale = function(s){
    this.model.scale.set(s, s, s);
  };

  SceneViewer.prototype.simulate = function() {
    this.model.simulate();
  }

  return SceneViewer;
});
