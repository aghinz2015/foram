'use strict';

app.controller('FilterLoaderCtrl', ['$scope', '$modalInstance', 'ForamAPIService', 'ToastService', function ($scope, $modalInstance, ForamAPIService, ToastService) {

  $scope.loadedFilters = [];
  $scope.selectedFilter = {};

  $scope.loadFilters = function () {
    $modalInstance.close($scope.selectedFilter.data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  ForamAPIService.getFilters().then(function (response) {
    $scope.loadedFilters = response.data.foram_filters;
  }, function (error) {
    ToastService.showToast('Cannot connect to server', 'error', 3000);
  });

}]);
