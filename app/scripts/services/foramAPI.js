/**
 * Created by ezimonczyk on 18/08/15.
 */
'use strict';

app.service('ForamAPIService', ['$http', 'api_host', function($http, api_host){


  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForams = function(params) {
    return $http.get(api_host + 'forams',{params: params});
  };


  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getGenerations = function(params) {
    return $http.get(api_host + 'generations',{params: params});
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForamsInfo = function(params) {
    return $http.head(api_host + 'forams', {params: params});
  }

}]);
