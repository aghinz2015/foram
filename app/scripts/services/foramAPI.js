/**
 * Created by ezimonczyk on 18/08/15.
 */
'use strict';

app.service('ForamAPIService',['$http','appConfig',function($http,appConfig){

  /**
   * Get all forams
   * @returns data
   */
  this.getAllForams = function() {
    return $http.get(appConfig.apiUrl)
      .then(
        function(data){
          return data;
      },
        function(error){
          throw error.status+" : "+error.statusText;
        })
  };
  /**
   * Get filteref forams
   * @param params
   * @returns data
   */
  this.getFilteredForams = function(params) {
    return $http.get(appConfig.apiUrl,params)
      .then(
      function(data){
        return data;
      },
      function(error){
        throw error.status+" : "+error.statusText;
      })
  };
}]);

