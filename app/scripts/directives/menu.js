/**
 * Created by Eryk on 2015-04-11.
 * */
'use strict';

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
    },

    link: function() {
      $(window).resize(function() {
        if ($(window).width() < 769) {
          $('.off-canvas-wrap').removeClass('move-right');
          $('.left-off-canvas-toggle').show();
        } else {
          $('.off-canvas-wrap').addClass('move-right');
          $('.left-off-canvas-toggle').hide();
        }
      });
    }
  }
});
