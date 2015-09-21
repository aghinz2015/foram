/**
 * Created by ezimonczyk on 28/08/15.
 */
'use strict';

app.service('Utils',['$location',function($location){

  /**
   * simple function imitating changing location
   * @returns null
   */
  this.goTo = function(location,className) {
      angular.element(document.getElementsByClassName(className+" active")).toggleClass('active');
      $location.path(location);
  };
}]);

