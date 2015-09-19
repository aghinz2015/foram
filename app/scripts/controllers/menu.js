/**
 * Created by Eryk on 2015-04-11.
 */
'use strict';

app.controller('menuCtrl',['$scope', '$location', 'ConfigService', 'AuthenticationService', function($scope, $location, ConfigService, AuthenticationService){

  // simple function to change location, works like a tag
  // #TODO create a service with this function
  $scope.go = function(url) {
    angular.element(document.getElementsByClassName('menu-option active')).toggleClass('active');
    $location.path(url);
  };

  $scope.logout = function() {
    AuthenticationService.logout().success(function() {
      AuthenticationService.clearCredentials();
      $location.path('/login');
    });
  };

  ConfigService.getMenu()
    .then(
      function(res){
        console.log(res.data);
        $scope.menu = res.data;
      },
      function(error){
        throw error.status+" : "+error.statusText;
      });
}]);
