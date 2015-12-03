'use strict';

app.controller('FilterDeleterCtrl', ['$scope', '$modalInstance', 'ForamAPIService', function ($scope, $modalInstance, ForamAPIService) {

  $scope.loadedFilters = [];
  $scope.selectedFilter = {};
  $scope.filtersDeleted = false;
  
  $scope.deleteFilters = function () {
    var id = $scope.selectedFilter.data._id.$oid;
    ForamAPIService.deleteFilters(id).then(function(response) {
      $scope.filtersDeleted = true;
    }, function(error) {
      console.log('deleteFilters::Error -', error);
    });  
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  ForamAPIService.getFilters().then(function (response) {
        $scope.loadedFilters = response.data.foram_filters;
      }, function (error) {
        console.log("getFilters::Error - ", error)
    });
  
}]);
