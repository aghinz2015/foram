'use strict';

app.directive('inplaceArrayEditor', function () {
  return {
    restrict: 'E',
    templateUrl: '/views/inplace_editor/array.html',
    scope: {
      value: "=",
      name: "@"
    },
    controller: function($scope, $controller) {
      $controller('InplaceBaseCtrl', { $scope: $scope });

      $scope.bindableValue = [];
      $scope.value.forEach(function (val) {
        $scope.bindableValue.push({ val: val });
      });

      $scope.focus = function () {
        $scope.adderTextField.select();
      };

      $scope.addNewElement = function () {
        var value = $scope.adderTextField.val();

        if (value !== "") {
          $scope.bindableValue.push({ val: value });
          $scope.adderTextField.val("");
          $scope.updateValue();
        }
      };

      var oldUpdate = $scope.updateValue;
      $scope.updateValue = function () {
        $scope.value = [];
        $scope.bindableValue.forEach(function(val) {
          $scope.value.push(val.val);
        });
        oldUpdate();
      };

      $scope.removeElement = function (value) {
        $scope.bindableValue.splice($scope.bindableValue.indexOf(value), 1);
        $scope.updateValue();
      }

      $scope.$watch('value', function () {
        $scope.bindableValue = [];
        $scope.value.forEach(function (val) {
          $scope.bindableValue.push({ val: val });
        });
      })
    },
    link: function ($scope, $element) {
      $scope.labelElement = $element.find(".label-element");
      $scope.editorElement = $element.find(".editor-element");
      $scope.adderTextField = $element.find(".new-array-element");
      $scope.hideEditor();
    }
  }
});