'use strict';

app.directive('inplacePasswordEditor', function () {
  return {
    restrict: 'E',
    templateUrl: '/views/inplace_editor/password.html',
    scope: {
      value: "=",
      name: "@"
    },
    controller: function($scope, $controller) {
      $controller('InplaceBaseCtrl', { $scope: $scope });

      $scope.focus = function () {
        $scope.passwordTextField.select();
      };

      $scope.savePassword = function () {
        var newPwd = $scope.passwordTextField.val();
        var newCon = $scope.confirmationTextField.val();

        if (newPwd == newCon) {
          $scope.value = newPwd;
          $scope.errorLabel.html("");
          $scope.updateValue();
          $scope.deactivateEditor();
        } else {
          $scope.errorLabel.html("Passwords don't match each other");
        }
      }
    },
    link: function ($scope, $element) {
      $scope.labelElement = $element.find(".label-element");
      $scope.editorElement = $element.find(".editor-element");
      $scope.passwordTextField = $element.find(".password-element");
      $scope.confirmationTextField = $element.find(".confirmation-element");
      $scope.errorLabel = $element.find(".error-element");
      $scope.hideEditor();
    }
  }
});