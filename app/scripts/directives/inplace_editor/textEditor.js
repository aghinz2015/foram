'use strict';

app.directive('inplaceTextEditor', function () {
  return {
    restrict: 'E',
    templateUrl: '/views/inplace_editor/text.html',
    scope: {
      value: "=",
      name: "@"
    },
    controller: function($scope, $controller) {
      $controller('InplaceBaseCtrl', { $scope: $scope });

      $scope.focus = function () {
        $scope.textField.select();
      };
    },
    link: function ($scope, $element) {
      $scope.labelElement = $element.find(".label-element");
      $scope.editorElement = $element.find(".editor-element");
      $scope.textField = $element.find(".text-field-element");
      $scope.hideEditor();
    }
  }
});