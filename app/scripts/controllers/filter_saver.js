'use strict';

app.controller('FilterSaverCtrl', function ($scope, $modalInstance, filtersToSave, ForamAPIService) {

  $scope.filtersToSave = filtersToSave;
  $scope.filtersSaved = false;
  
  $scope.saveFilters = function () {
    ForamAPIService.saveFilters(filtersToSave);
    $scope.filtersSaved = true;
  };
  
  $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
  };
    
});
