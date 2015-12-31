'use strict';

app.controller('FilterDeleterCtrl', ['$scope', '$modalInstance', 'filter', 'ForamAPIService', function ($scope, $modalInstance, filter, ForamAPIService) {

  $scope.filter = filter;
  var deleted = false;

  $scope.deleteFilters = function () {
    var id = $scope.filter._id.$oid;
    ForamAPIService.deleteFilters(id).then(function (response) {
      if (response.status < 400) {
        deleted = true;
      }
      $modalInstance.close(deleted);
    }, function (error) {
      $modalInstance.close(deleted);
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
