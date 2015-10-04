'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:DatabasesCtrl
 * @description
 * # DatabasesCtrl
 * Controller of the trunkApp
 */
app.controller('DatabasesCtrl', ['$scope', '$http', '$q', 'ForamAPIService', function ($scope, $http, $q, api) {
  $scope.init = function () {
    api.getDatabases().then(
      function (response) {
        $scope.databases = response.data.mongo_sessions;
        $scope.loaded = true;
      }, function (error) {
        $scope.error = error;
      }
    );
  };

  $scope.$on('database-status-changed', function(event, newActiveDatabase) {
    if (!newActiveDatabase.active) return;

    $scope.databases.forEach(function (database) {
      if (database.active && database.id != newActiveDatabase.id)
        database.active = false;
    });
  });

  $scope.$on('deleting-database', function(event, params) {
    $scope.databases.splice($scope.databases.indexOf(params, 1));
  });

  $scope.headers = ["Name", "Hosts", "Database", "Username", "Password", "Actions"]

  $scope.init();
}]);
