'use strict';

app.controller('FilterLoaderCtrl', ['$scope', '$modalInstance', 'ForamAPIService', function ($scope, $modalInstance, ForamAPIService) {

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
        console.log("getForamsInfo::Error - ", error)
    });
  
}]);
