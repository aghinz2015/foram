/**
 * Created by ezimonczyk on 19/08/15.
 */
'use strict';

app.service('ConfigService',['$http','appConfig',function($http,appConfig){

  /**
   * Get HighChart Theme
   * @returns data
   */
  this.getHighchart = function() {
    return $http.get("/config/highchart.json");
  };

  this.getFilterConfig= function() {
    return $http.get("/config/filter.json")
      .then(
      function(data){
        return data;
      },
      function(error){
        throw error.status+" : "+error.statusText;
      })
  };

  /**
   * Get menu config
   * @returns {*}
   */
  this.getMenu = function() {
    return $http.get("/config/menu.json");
  }
}]);

