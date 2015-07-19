/**
 * Created by Eryk on 2015-04-11.
 * */
'use strict';

// menu directive - menu must be a JSON object
app.directive('menu',function(){
  return {
    restrict: 'E',
    scope: {
      menu: "="
    },
    templateUrl: '/views/menu-temp.html'
  }
});

// menuPosition directive - responisble for creating menu sub-levels
// #TODO click function will no longer be in position object - different service will be responsible
app.directive('menuPosition',function($compile,$templateCache){
  return {
    restrict: 'E',
    scope: {
      position: "="
    },
    templateUrl: '/views/submenu-temp.html',
    link: function(scope,element,attr){

      //var template = $templateCache.get('/views/submenu-temp.html')[1]; //WINDOWS only
      var template = $templateCache.get('/views/submenu-temp.html');  //UNIX/OSX only

      if (scope.position.list) {
        template += '<ul  class="submenu"><menu-position ng-repeat="subposition in position.list" position="subposition"></menu-position></ul>';
      }

      template = '<li class="menu-option" id="{{position.args}}" ng-click="position.click(position.args)">'+template+'</li>';
      var newElement = angular.element(template);
      $compile(newElement)(scope);

      element.replaceWith(newElement);
    }
  }
});
