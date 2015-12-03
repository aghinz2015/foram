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
  this.getForams = function (params, format) {
    if (format === undefined)
      format = '';
    return $http.get(foramsUrl + format, { params: params });
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
  this.getForamsInfo = function(params) {
    return $http.head(foramsUrl, {params: params});
  };

  this.getFilters = function(params) {
    return $http.get(api_host + "foram_filters", {params: params});
  };

  this.saveFilters = function(params) {
    return $http.post(api_host + "foram_filters", {foram_filter: params});
  };
  
  this.deleteFilters = function(id) {
    return $http.delete(api_host + "foram_filters/" + id);
  };
  
  this.editFilters = function(id, params) {
    return $http.put(api_host + "foram_filters/" + id, {foram_filter: params});
  };
  
}]);

