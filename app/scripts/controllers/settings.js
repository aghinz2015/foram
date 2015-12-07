'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the trunkApp
 */
app.controller('SettingsCtrl',['$scope', '$location', '$modal', 'UserService', 'ConfigService', 'ToastService', 'ForamAPIService', function ($scope, $location, $modal, UserService, ConfigService, ToastService, ForamAPIService) {


  // Redirect to database tab if coming from 'databases' path

  if($location.path() == '/databases'){
    $scope.redirect = true;
    $scope.direct = false;
  } else {
    $scope.direct = true;
    $scope.redirect = false;
  }

  ////////////////////////    GENERAL     ///////////////////////////

  var databaseModal;
  $scope.loader = false;

  var refresh = function() {
    UserService.getDatabases().then(
      function (res) {
        if(res.data) {
          if(res.status < 400) {
            $scope.databases = res.data.mongo_sessions;
          } else {
            ToastService.showServerToast(res.data,'error',3000);
          }
        }
      },
      function (err) {
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    )
  };

  ////////////////////////    USER SETTINGS     ///////////////////////////

  $scope.user = {};

  $scope.saveUserData = function(data){
    $scope.loader = true;
    UserService.updateUserData(data).then(
      function(res){
        if(res.status < 400) {
          $scope.loader = false;
          ToastService.showToast("Profile updated!",'success',3000);
        } else {
          $scope.loader = false;
          ToastService.showServerToast(res.data,'error',3000);
        }
      },
      function(err){
        $scope.loader = false;
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    );
  };

  UserService.getUserData().then(
    function(res){
      if(res.data && res.status < 400) {

        console.log(res.data.user.settings_set.mappings);

        $scope.settings.number_precision = res.data.user.settings_set.number_precision;

        if(!angular.equals({},res.data.user.settings_set.mappings)) {
          for (var gene in res.data.user.settings_set.mappings) {
            if (res.data.user.settings_set.mappings.hasOwnProperty(gene)) {
              $scope.settings.mappings.push({name: gene, display: res.data.user.settings_set.mappings[gene]});
            }
          }
        } else {
          ForamAPIService.getForamsAttributes().then(
            function(res){
              if(res.data && res.status < 400) {
                for (var i = 0; i < res.data.forams.length; i++) {
                  if(res.data.forams[i] != 'foram_id')
                    $scope.settings.mappings.push({name: res.data.forams[i], display: ""});
                }
              } else {
                ToastService.showServerToast(res.data,'error',3000);
              }
            },
            function(err){
              ToastService.showToast('Cannot connect to server','error',3000);
            }
          )
        }

        $scope.user.email = res.data.user.email;
        $scope.user.username = res.data.user.username;
        $scope.user.password = $scope.user.password_confirmation = "";
      } else {
        ToastService.showServerToast(res.data,'error',3000);
      }
    },
    function(error){
      ToastService.showToast('Cannot connect to server','error',3000);
    }
  );

  ////////////////////////    DISPLAY SETTINGS     ///////////////////////////

  $scope.settings = {mappings: []};

  $scope.saveSettings = function(settings){
    UserService.updateUserSettings(settings).then(
      function(res){
        if(res.status < 400) {
          $scope.loader = false;
          ToastService.showToast("Display settings updated!",'success',3000);
        } else {
          $scope.loader = false;
          ToastService.showServerToast(res.data,'error',3000);
        }
      },
      function(err){
        $scope.loader = false;
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    );
  };

  ////////////////////////    DATABASES SETTINGS     ///////////////////////////


  $scope.editableDatabase = {
    hosts: []
  };

  $scope.databases = [];

  $scope.saveDatabase = function(database){
    $scope.loader = true;
    UserService.updateDatabase(database).then(
      function(res){
        if(res.status < 400) {
          databaseModal.close();
          $scope.loader = false;
          refresh();
          ToastService.showToast("Database saved!",'success',3000);
        } else {
          $scope.loader = false;
          ToastService.showServerToast(res.data,'error',3000);
        }
      },
      function(err){
        $scope.loader = false;
        ToastService.showToast('Cannot connect to server','error',3000);
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
        if(res.status < 400) {
          refresh();
          ToastService.showToast("Databse enabled!",'success',3000);
        } else {
          ToastService.showServerToast(res.data,'error',3000);
        }

      },
      function(err) {
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    );
  };

  $scope.disableDatabase = function(database) {
    UserService.changeDatabaseStatus(database,false).then(
      function(res) {
        if(res.status < 400) {
          refresh();
          ToastService.showToast("Database disabled!",'success',3000);
        } else {
          ToastService.showServerToast(res.data,'error',3000);
        }
      },
      function(err) {
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    );
  };

  $scope.deleteDatabase = function(database) {
    UserService.deleteDatabase(database).then(
      function(res){
        if(res.status < 400) {
          refresh();
          ToastService.showToast("Database deleted!",'success',3000);
        } else {
          ToastService.showServerToast(res.data,'error',3000);
        }
      },
      function(err){
        ToastService.showToast('Cannot connect to server','error',3000);
      }
    );
  };

  ////////////////////////    INIT    ///////////////////////////

  refresh();

}]);
