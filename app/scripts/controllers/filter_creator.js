'use strict';

app.controller('FilterCreatorCtrl', function ($scope, $modalInstance, availableFilterParams, precision, filters, ForamAPIService, ToastService) {
  
  var params = filters;
  
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
      params['attribute'] = $scope.newFilter.param;
      ForamAPIService.getAttributeStats(params).then(
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
