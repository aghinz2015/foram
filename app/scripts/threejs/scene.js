/**
 * Created by ezimonczyk on 21/07/15.
 */

'use strict';

/**
 * This is the 3D scene constructor.
 *
 * This singleton allows for encapsulated access to all components of the 3D scene.
 * @param params
 * @constructor
 */
Viewer.Scene = function (params) {

  params.context = this;
  this.container = $(params.containerId);
  this.model = null;
  this.scene = null;
  this.renderer = null;
  this.setup = null;
  this.camera = null;
  this.init(params);

};

Viewer.Scene.prototype = {

  /**
   * Initialize our scene
   */
  init: function (params) {
    console.log("Scene init");
    this.camera = new Viewer.Scene.Camera(params);
    this.webGLRenderer = new Viewer.Scene.Renderer(params);
    this.scene = new THREE.Scene();
    this.setup = new Viewer.Scene.Setup(params);
    this.controls = new THREE.OrbitControls(this.camera.liveCamera);
    // add the output of the renderer to the html element
    this.container.append(this.webGLRenderer.domElement);

    this.listeners();
  },


  /**
   * Handles all of events
   */
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

    this.controls.addEventListener('change', this.webGLRenderer.render(this.scene,this.camera.liveCamera));
  },

  /**
   * Resizes camera,renderer when document is resized.
   */
  onWindowResize: function () {

    this.WIDTH = window.innerWidth*0.8;
    this.HEIGHT = window.innerHeight*0.8;
    this.camera.resize(this.WIDTH,this.HEIGHT);
    this.webGLRenderer.resize(this.WIDTH,this.HEIGHT);
  }
};