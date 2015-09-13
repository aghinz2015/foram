/**
 * Created by ezimonczyk on 18/08/15.
 */
'use strict';

app.service('ForamAPIService',['$http','appConfig',function($http,appConfig){


  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForams = function(params) {
    return $http.get(appConfig.apiForamsUrl,{params: params});
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForamsInfo = function(params) {
    return $http.head(appConfig.apiForamsUrl, {params: params});
  }

}]);

