'use strict';

app.controller('ForamDownloaderCtrl', function ($scope, $modalInstance) {

  $scope.availableFormats = [{ display: 'Comma-separated values', value: '.csv'}, { display: 'Framsticks (.gen)', value: '.gen'}];

  $scope.newDownload = { format: '.csv', fileName: 'forams' };

  $scope.download = function () {
    $modalInstance.close($scope.newDownload);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
