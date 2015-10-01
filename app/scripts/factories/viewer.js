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

  SceneViewer.prototype.evolve = function() {
    this.model.evolve();
  };

  SceneViewer.prototype.regress = function() {
    this.model.regress();
  };

  return SceneViewer;
});
