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

        var db = findDatabaseByName(response.data.active_id);
        if (db !== undefined) db.status = 'enabled';
      }, function (error) {
        $scope.error = error;
      }
    );
  };

  var findDatabaseByName = function (id) {
    for (var i in $scope.databases) {
      if ($scope.databases[i].id === id) return $scope.databases[i];
    }
  }

  $scope.changeDatabaseStatus = function (id, newStatus) {
    api.changeDatabaseStatus(id, newStatus).then(
      function (result) {
        $scope.databases.forEach(function (database) {
          if (database.id == id)
            database.active = result.data.mongo_session.active;
          else
            database.active = false;
        });
      }, function (error) {
        $scope.error = error;
      }
    );
  }

  $scope.headers = ["Name", "Hosts", "Database", "Username", "Actions"]

  $scope.init();
}]);
