/**
 * Created by ezimonczyk on 19/08/15.
 */
'use strict';

app.service('ConfigService',['$http','appConfig',function($http,appConfig){
  this.getConfig = function(name) {
    return $http.get("/config/" + name + ".json");
  };

  /**
   * Get HighChart Theme
   * @returns data
   */
  this.getHighchart = function() {
    return $http.get("/config/highchart.json");
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getFilterConfig= function() {
    return $http.get("/config/filter.json");
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getChartConfig= function() {
    return $http.get("/config/chart.json");
  };

  /**
   * Get menu config
   * @returns {*}
   */
  this.getMenu = function() {
    return $http.get("/config/menu.json");
  }

  this.getExportOptions = function() {
    return $http.get("/config/export_options.json")
  }
}]);
