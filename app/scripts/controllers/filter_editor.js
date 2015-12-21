'use strict';

app.controller('FilterEditorCtrl', ['$scope', '$modalInstance', 'filter', 'availableFilterParams', function ($scope, $modalInstance, filter, availableFilterParams) {
  $scope.availableFilterParams = availableFilterParams;
  $scope.filter = filter;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.save = function () {
    $modalInstance.close($scope.filter);
  };
    
}]);
