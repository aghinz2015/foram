'use strict';

app.controller('FilterSaverCtrl', function ($scope, $modalInstance, filtersToSave, ForamAPIService) {

  $scope.filtersToSave = filtersToSave;
  $scope.filtersSaved = false;
  
  $scope.saveFilters = function () {
    ForamAPIService.saveFilters(filtersToSave).then(function(response) {
      $scope.filtersSaved = true;
    }, function(error) {
      console.log('saveFilters::Error -', error);
    });
    
  };
  
  $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
  };
    
});
