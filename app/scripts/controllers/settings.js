'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the trunkApp
 */
app.controller('SettingsCtrl',['$scope', '$modal', 'UserService',  function ($scope, $modal, UserService) {
  $scope.settings = {mappings: []};
  $scope.user = {};
  $scope.loader = false;
  $scope.editableDatabase = {};

  $scope.saveSettings = function(settings){
    UserService.updateUserSettings(settings);
  };

  $scope.saveUserData = function(data){
    $scope.loader = true;
    UserService.updateUserData(data).then(
      function(res){
        $scope.loader = false;
      },
      function(err){
        $scope.loader = false;
        console.error(err)
      }
    );
  };

  $scope.newDatabase = function(database){
    if(database){
      $scope.editableDatabase = database;
    }

    $modal.open({
      scope: $scope,
      templateUrl: 'views/database-modal.html',
      windowClass: 'small'
    });
  };



  UserService.getUserData().then(
    function(res){

      $scope.settings.number_precision = res.data.user.settings_set.number_precision;
      for(var gene in res.data.user.settings_set.mappings){
        if (res.data.user.settings_set.mappings.hasOwnProperty(gene)) {
          $scope.settings.mappings.push({name: gene,display: res.data.user.settings_set.mappings[gene]});
        }
      }

      $scope.user.email = res.data.user.email;
      $scope.user.username =  res.data.user.username;
      $scope.user.password = $scope.user.password_confirmation = "";
    },
    function(error){
      console.error(error);
    }
  );

  UserService.getDatabases().then(
    function (res) {
      $scope.databases = res.data;
      console.log(res);
    },
    function (err) {
      console.error(err);
    }
  );


}]);
