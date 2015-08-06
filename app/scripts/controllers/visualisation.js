'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:VisualisationCtrl
 * @description
 * # VisualisationCtrl
 * Controller of the trunkApp
 */
app.controller('VisualisationCtrl',['$scope','ViewerFactory', function ($scope,ViewerFactory) {

  // initialize our ViewerFactory responsible for 3D visualisation
  var viewer = new ViewerFactory({
    containerId: '#WebGL-output'
  });

  $scope.data = {
    'scale': 2,
    'rotateX': 0,
    'rotateY': 0,
    'rotateZ': 0,
    'positionX': 0,
    'positionY': 0,
    'positionZ': 0
  };

  // scale the model.
  $scope.scale = function () {
    viewer.scale(this.data.scale);
  };

  // rotate around an axis
  $scope.rotate = function () {
    viewer.rotate(
      parseFloat(this.data.rotateX),
      parseFloat(this.data.rotateY),
      parseFloat(this.data.rotateZ))
  };

  // translate around the scene
  $scope.translate = function () {
    viewer.translate(
      parseFloat(this.data.positionX),
      parseFloat(this.data.positionY),
      parseFloat(this.data.positionZ))
  };

  // #TODO do we want an AngularJS toolbar to control our WebGL view or just mouse move?s
}]);
