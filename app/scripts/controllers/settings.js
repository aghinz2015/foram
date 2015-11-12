'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the trunkApp
 */
app.controller('SettingsCtrl',['$scope', 'UserService',  function ($scope, UserService) {
  $scope.settings = {mappings: []};
  $scope.user = {};
  $scope.loader = false;

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
    },
    function(error){
      console.error(error);
    }
  );

  $scope.saveSettings = function(settings){
    UserService.updateUserSettings(settings);
  };

  $scope.saveUserData = function(data){
    UserService.updateUserData(data);
  }
}]);
