/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

/**
 * This is the 3D scene constructor.
 * Notice it also constructions a bunch of the WebGL & Three resources necessary for the scene.
 *
 * This singleton allows for encapsulated access to all components of the 3D scene.
 *
 **/

Viewer.Scene = function (params) {

  params.context = this;
  this.container = $(params.containerId);
  this.context = params.context;
  this.model = null;
  this.scene = null;
  this.renderer = null;
  this.setup = null;
  this.camera = null;
  this.init();

};

Viewer.Scene.prototype = {

  init: function () {

    console.log("Scene init");
    var params = {context: this};
    this.camera = new Viewer.Scene.Camera(params);
    this.webGLRenderer = new Viewer.Scene.Renderer(params);
    this.scene = new THREE.Scene();
    this.setup = new Viewer.Scene.Setup(params);

    // add the output of the renderer to the html element
    this.container.append(this.webGLRenderer.renderer.domElement);
    this.listeners();
  },



  listeners: function () {
    var to = null;
    window.addEventListener( 'resize', function(){

      // if timeout already set, clear it so you can set a new one
      // this prevents N resize events from resizing the canvas
      if(to){
        clearTimeout(to);
      }
      to = setTimeout(function () {
        this.onWindowResize();
      }.bind(this), 100);
    }.bind(this), false );
  },

  /**
   * Resizes the camera when document is resized.
   */
  onWindowResize: function () {

    this.WIDTH = window.innerWidth*0.8;
    this.HEIGHT = window.innerHeight*0.8;
    this.camera.liveCamera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.liveCamera.updateProjectionMatrix();
    this.webGLRenderer.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.webGLRenderer.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
  }
};
