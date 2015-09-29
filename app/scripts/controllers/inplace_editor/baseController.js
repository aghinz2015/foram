/**
 * Common logic for inplace editors
 * Expects following attributes to be defined:
 *   $scope.labelElement
 *   $scope.editorElement
 *   $scope.value
 *   $scope.name
 *   $scope.focus (optional)
 */

'use strict';

app.controller('InplaceBaseCtrl', function ($scope, $animate) {
  $scope.focus = function () { };

  $scope.activateEditor = function () {
    $scope.editorActive = true;

    $scope.hideLabel().then(function () {
      $scope.showEditor().then(function () {
        $scope.focus();
      });
    });
  };

  $scope.deactivateEditor = function () {
    $scope.editorActive = false;

    $scope.hideEditor().then(function () {
      $scope.showLabel();
    });
  };

  $scope.hideLabel = function () {
    return $animate.addClass($scope.labelElement, "ng-hide");
  };

  $scope.showLabel = function () {
    return $animate.removeClass($scope.labelElement, "ng-hide");
  }

  $scope.hideEditor = function () {
    return $animate.addClass($scope.editorElement, "ng-hide");
  };

  $scope.showEditor = function () {
    return $animate.removeClass($scope.editorElement, "ng-hide");
  };

  $scope.$on('edit', function () {
    $scope.editorActive = true;
    $scope.initialValue = $scope.value;
    $scope.activateEditor();
  });

  $scope.$on('save', function () {
    $scope.editorActive = false;
    $scope.deactivateEditor();
  });

  $scope.$on('cancel', function () {
    $scope.value = $scope.initialValue;
    $scope.editorActive = false;
    $scope.deactivateEditor();
  });

  $scope.updateValue = function () {};

  $scope.init = function () {
    $scope.editorActive = false;
    $scope.initialValue = $scope.value;
    $scope.eventEmitted = false;
  };

  $scope.init();
});