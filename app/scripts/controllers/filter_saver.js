'use strict';

app.controller('FilterSaverCtrl', function ($scope, $modalInstance, filtersToSave, ForamAPIService, ToastService) {

  $scope.filtersToSave = filtersToSave;

  $scope.saveFilters = function () {
    ForamAPIService.saveFilters(filtersToSave).then(function (response) {
      if (response.status < 400) {
        ToastService.showToast('Set saved successfully', 'success', 3000);
      } else {
        ToastService.showServerToast(response.data, 'error', 3000);
      }
    }, function (error) {
      ToastService.showToast('Cannot connect to server', 'error', 3000);
    });
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
