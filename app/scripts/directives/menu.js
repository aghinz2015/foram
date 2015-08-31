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
    templateUrl: '/views/menu-temp.html',
    controller: function($scope, Utils) {
      $scope.goTo = function(location, className) {
        Utils.goTo(location, className);
      }
    }
  }
});

