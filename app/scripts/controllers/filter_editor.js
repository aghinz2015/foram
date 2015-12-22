'use strict';

app.controller('FilterEditorCtrl', ['$scope', '$modalInstance', 'filter', 'availableFilterParams', function ($scope, $modalInstance, filter, availableFilterParams) {
  $scope.availableFilterParams = availableFilterParams;
  $scope.filter = {param: filter.param, min: filter.min, max: filter.max};
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.save = function () {
    $modalInstance.close($scope.filter);
  };
    
}]);
