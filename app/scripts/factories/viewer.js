/**
 * Created by ezimonczyk on 20/07/15.
 */
'use strict';

app.factory('ViewerFactory',function(){

  var home;

  // initialize 3D scene
  function init(params) {
    home = new Viewer.Scene(params);
    animate();

  }

  function animate(){
    requestAnimationFrame(animate);
    render();
  }

  function render(){
    home.webGLRenderer.renderer.render(home.scene,home.camera.liveCamera);
  }

  function rotate(x, y, z) {
    home.model.rotation.set(
      THREE.Math.degToRad(x),
      THREE.Math.degToRad(y),
      THREE.Math.degToRad(z)
    );
  }

  function translate(x, y, z){
    home.model.position.set(x, y, z)
  }

  function scale(s) {
    home.model.scale.set(s, s, s);
  }

  // #TODO think about other useful functions like invisible foram walls, step by step growth etc.

  return {
    init: init,
    rotate: rotate,
    translate: translate,
    scale: scale
  }
});

