/**
 * Created by ezimonczyk on 18/08/15.
 */
'use strict';

app.service('ForamAPIService', ['$http', 'api_host', function ($http, api_host) {

  var foramsUrl = api_host + 'forams';
  var generationsUrl = api_host + 'generations';
  var databasesUrl = api_host + 'user/mongo_sessions';
  var databaseUrl = function (id) { return [databasesUrl, id].join('/'); }

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForams = function (params) {
    return $http.get(foramsUrl, { params: params });
  };


  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getGenerations = function (params) {
    return $http.get(generationsUrl, { params: params });
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForamsInfo = function (params) {
    return $http.head(foramsUrl, { params: params });
  }
}]);
