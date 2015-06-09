/**
 * Created by Eryk on 2015-04-11.
 * */
'use strict';

app.directive('menu',function(){
  return {
    restrict: 'E',
    scope: {
      menu: "=menu"
    },
    templateUrl: '/views/menu-temp.html'
  }
});

app.directive('menuPosition',function($location,$compile,$templateCache){
  return {
    restrict: 'E',
    scope: {
      position: "="
    },
    templateUrl: '/views/submenu-temp.html',
    link: function(scope,element,attr){
      var template = $templateCache.get('/views/submenu-temp.html')[1];
      console.log(template);
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
