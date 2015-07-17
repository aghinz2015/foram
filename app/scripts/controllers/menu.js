/**
 * Created by Eryk on 2015-04-11.
 */
'use strict';

app.controller('menuCtrl',function($scope,$location){

  // simple function to change location, works like a tag
  // #TODO create a service with this function
  $scope.go = function(url) {
    angular.element(document.getElementsByClassName('menu-option active')).toggleClass('active');
    $location.path(url);
  };


  // menu config - #TODO put it into JSON file
  $scope.menu = {
    name: 'FORAM',
    icon: 'bars',
    list: [
      {
        name: 'Home',
        icon: 'home',
        args: '/',
        click: $scope.go

      },
      {
        name: 'Databases',
        icon: 'database',
        args: '/databases',
        click: $scope.go
      },
      {
        name: 'Browse',
        icon: 'folder-open',
        args: '/table',
        click: $scope.go
      },
      {
        name: '3D Visualisation',
        icon: 'cube',
        args: '/visualisation',
        click: $scope.go

      },
      {
        name: 'Charts',
        icon: 'pie-chart',
        args: '/charts',
        click: $scope.go
      },
      {
        name: 'Settings',
        icon: 'gear',
        args: '/settings',
        click: $scope.go

      }
    ]
  };
});
