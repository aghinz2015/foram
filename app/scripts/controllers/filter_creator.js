'use strict';

app.controller('FilterCreatorCtrl', function ($scope, $modalInstance, availableFilterParams, precision, ForamAPIService, ToastService) {

  $scope.availableFilterParams = availableFilterParams;
  $scope.precision = precision;
  
  $scope.newFilter = {};

  $scope.createFilter = function () {
    $modalInstance.close($scope.newFilter);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.$watch('newFilter.param', function () {
    if ($scope.newFilter.param !== undefined) {
      ForamAPIService.getAttributeStats($scope.newFilter.param).then(
        function (res) {
          if (res.data) {
            if (res.status < 400) {
              $scope.stats = res.data;
            } else {
              ToastService.showServerToast(res.data, 'error', 3000);
            }
          }
        }, function (err) {
          ToastService.showToast('Cannot connect to server', 'error', 3000);
        }
        );
    }
  });

});
