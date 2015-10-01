'use strict';

app.directive('databaseEntry', function () {
  return {
    restrict: 'A',
    templateUrl: '/views/databases/database-entry.html',
    scope: {
      database: "=databaseEntry"
    },
    controller: function($scope, ForamAPIService) {
      $scope.edit = function () {
        $scope.editing = true;
        $scope.$broadcast('edit');
      }

      $scope.cancel = function () {
        $scope.editing = false;
        $scope.$broadcast('cancel');
      }

      $scope.delete = function () {
        $scope.$emit('deleting-database', { database: $scope.database });
        ForamAPIService.deleteDatabase($scope.database);
      }

      var processResponse = function (databasePromise) {
        databasePromise.then(function (response) {
          if (response.status < 300) {
            angular.extend($scope.database, response.data.mongo_session);
          } else {
            $scope.error = response.data;
          }
        }, function (error) {
          $scope.error = error;
        });
      }

      $scope.save = function () {
        processResponse(ForamAPIService.saveDatabase($scope.database));
        $scope.editing = false;
        $scope.$broadcast('save');
      }

      $scope.changeDatabaseStatus = function (newStatus) {
        $scope.database.active = newStatus;
        $scope.$emit('database-status-changed', $scope.database);
        processResponse(ForamAPIService.changeDatabaseStatus($scope.database.id, newStatus));
      }


    },
    link: function ($scope) {
      if ($scope.database.id) {
        $scope.editing = false;
      } else {
        $scope.edit();
      }
    }
  }
});