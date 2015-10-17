/**
 * Created by Eryk on 2015-04-11.
 * */
'use strict';

// menu directive - menu must be a JSON object
app.directive('menu', function(){
  return {
    restrict: 'E',
    scope: {
      menu: "="
    },
    templateUrl: '/views/sidebar.html',

    controller: function($scope, Utils,AuthenticationService,$location) {
      $scope.goTo = function(location, className) {
        Utils.goTo(location, className);
      };

      $scope.logout = function() {
        AuthenticationService.logout().success(function() {
          AuthenticationService.clearCredentials();
          $location.path('/sign');
        });
      };

    }
  }
});
