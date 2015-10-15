/**
 * Created by ezimonczyk on 19/08/15.
 */
'use strict';

app.service('ConfigService', ['$http', 'api_host', function($http, api_host){
  this.getConfig = function(name) {
    return $http.get(api_host + "config/" + name + ".json");
  };

  /**
   * Get HighChart Theme
   * @returns data
   */
  this.getHighchart = function() {
    return $http.get(api_host + "config/highchart.json");
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getFilterConfig= function() {
    return $http.get(api_host + "config/filter.json");
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getChartConfig= function() {
    return $http.get(api_host + "config/chart.json");
  };

  /**
   * Get menu config
   * @returns {*}
   */
  this.getMenu = function() {
    return $http.get(api_host + "config/menu.json");
  }

  this.getExportOptions = function() {
    return $http.get(api_host + "config/export_options.json")
  }
}]);
