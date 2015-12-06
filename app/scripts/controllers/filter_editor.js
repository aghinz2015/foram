'use strict';

app.controller('FilterEditorCtrl', ['$scope', '$modalInstance', 'ForamAPIService', 'availableFilterParams' ,function ($scope, $modalInstance, ForamAPIService, availableFilterParams) {
  $scope.availableFilterParams = availableFilterParams;
  $scope.loadedFilters = [];
  $scope.selectedFilter = {};
  $scope.filtersSaved = false;
  $scope.constFilters = {};
  $scope.constFilters.is_diploid;
  $scope.constFilters.is_haploid;
  
  $scope.$watch('selectedFilter.data', function() {
    if($scope.selectedFilter.data === undefined) return;
    if($scope.selectedFilter.data.is_diploid != undefined) {
      $scope.constFilters.is_diploid = $scope.selectedFilter.data.is_diploid;
      $scope.constFilters.is_haploid = !$scope.constFilters.is_diploid; 
    }
  });
  
  $scope.saveFilters = function () {
    var params = getParams($scope.selectedFilter.data);
    var id = $scope.selectedFilter.data._id.$oid;
    
    ForamAPIService.editFilters(id, params).then(function(response) {
      $scope.filtersSaved = true;
    }, function(error) {
      console.log('editFilters::Error -', error);
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  ForamAPIService.getFilters().then(function (response) {
        $scope.loadedFilters = response.data.foram_filters;
      }, function (error) {
        console.log('getFilters::Error - ', error)
    });
    
  var getParams = function (filter) {
    var params = {};
    $scope.availableFilterParams.forEach(function(key) {
      if(filter[key+'_min'] != undefined) params[key+'_min'] = filter[key+'_min']; 
      if(filter[key+'_max'] != undefined) params[key+'_max'] = filter[key+'_max'];
    });
    if (($scope.constFilters.is_diploid && $scope.constFilters.is_haploid) || (!$scope.constFilters.is_diploid && !$scope.constFilters.is_haploid)) {
      params.is_diploid = null;
    } else {
      params.is_diploid = !$scope.constFilters.is_haploid;
    }
    params.name = filter.name;
    console.log(params);
    return params;
  };
  
}]);
