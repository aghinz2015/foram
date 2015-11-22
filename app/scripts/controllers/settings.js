'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the trunkApp
 */
app.controller('SettingsCtrl',['$scope', '$location', '$modal', 'UserService',  function ($scope, $location, $modal, UserService) {

  if($location.path() == '/databases'){
    $scope.redirect = true;
    $scope.direct = false;
  } else {
    $scope.direct = true;
    $scope.redirect = false;
  }

  $scope.settings = {mappings: []};
  $scope.user = {};
  $scope.loader = false;
  $scope.editableDatabase = {
    hosts: []
  };
  $scope.databases = [];

  var databaseModal;

  var refresh = function() {
    UserService.getDatabases().then(
      function (res) {
        if(res.data) {
          $scope.databases = res.data.mongo_sessions;
        }
      },
      function (err) {
        console.error(err);
      }
    )
  };

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

  $scope.saveDatabase = function(database){
    $scope.loader = true;
    UserService.updateDatabase(database).then(
      function(res){
        databaseModal.close();
        $scope.loader = false;
        refresh();
      },
      function(err){
        $scope.loader = false;
        console.error(err);
      }
    )
  };

  $scope.editDatabase = function(database){
    if(database){
      $scope.editableDatabase = database;
    } else {
      $scope.editableDatabase = {
        hosts: [],
        password:  null
      };
    }

    databaseModal = $modal.open({
      scope: $scope,
      templateUrl: 'views/database-modal.html',
      windowClass: 'small'
    });
  };

  $scope.enableDatabase = function(database) {
    UserService.changeDatabaseStatus(database,true).then(
      function(res) {
        refresh();
      },
      function(err) {
        console.error(err);
      }
    );
  };

  $scope.disableDatabase = function(database) {
    UserService.changeDatabaseStatus(database,false).then(
      function(res) {
        refresh();
      },
      function(err) {
        console.error(err);
      }
    );
  };

  $scope.deleteDatabase = function(database) {
    UserService.deleteDatabase(database).then(
      function(res){
        refresh();
      },
      function(err){
        console.error(err);
      }
    );
  };


  UserService.getUserData().then(
    function(res){
      if(res.data) {
        $scope.settings.number_precision = res.data.user.settings_set.number_precision;
        for (var gene in res.data.user.settings_set.mappings) {
          if (res.data.user.settings_set.mappings.hasOwnProperty(gene)) {
            $scope.settings.mappings.push({name: gene, display: res.data.user.settings_set.mappings[gene]});
          }
        }

        $scope.user.email = res.data.user.email;
        $scope.user.username = res.data.user.username;
        $scope.user.password = $scope.user.password_confirmation = "";
      }
    },
    function(error){
      console.error(error);
    }
  );

  refresh();


}]);
