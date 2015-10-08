/**
 * Created by Eryk on 2015-04-11.
 */
'use strict';

app.controller('menuCtrl',['$scope', '$location', 'ConfigService', 'AuthenticationService', function($scope, $location, ConfigService, AuthenticationService){

  ConfigService.getMenu()
    .then(
      function(res){
        $scope.menu = res.data;
      },
      function(error){
        throw error.status+" : "+error.statusText;
      });
}]);
