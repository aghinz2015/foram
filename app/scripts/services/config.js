/**
 * Created by ezimonczyk on 19/08/15.
 */
'use strict';

app.service('ConfigService',['$http','appConfig',function($http,appConfig){

  /**
   * Get HighChart Theme
   * @returns data
   */
  this.getHighchartTheme = function() {
    return $http.get("/config/highchart-theme.json")
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

