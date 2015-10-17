'use strict';

app.controller('FilterCreatorCtrl', function ($scope, $modalInstance, availableFilterParams) {

  $scope.availableFilterParams = availableFilterParams;

  $scope.newFilter = {};

  $scope.createFilter = function () {
    $modalInstance.close($scope.newFilter);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
