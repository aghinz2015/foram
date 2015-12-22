app.service('ForamAPIService', ['$http', 'api_host', function ($http, api_host) {

  var foramsUrl = api_host + 'forams',
      attributesUrl = api_host + 'forams/attribute_names',
      simulationsUrl = api_host + 'forams/simulation_starts',
      generationsUrl = api_host + 'generations',
      databasesUrl = api_host + 'user/mongo_sessions',
      deathCoordinatesUrl = api_host + 'death_coordinates',
      databaseUrl = function (id) { return [databasesUrl, id].join('/');},
      descendantsUrl = function(foramId) { return foramsUrl + '/' + foramId + '/descendants';},
      simulation;


  /**
   *
   * @param simulation_id
     */
  this.setSimulation = function(simulation_id) {
    simulation = simulation_id;
  };

  this.getCurrentSimulation = function() {
    return simulation;
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForams = function (params, format) {
    if (format === undefined)
      format = '';
    if(simulation) {
      params['simulation_start'] = simulation;
    }
    return $http.get(foramsUrl + format, { params: params });
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getForamsAttributes = function () {
    return $http.get(attributesUrl);
  };

  /**
   *
   * @returns {HttpPromise}
   */
  this.getSimulations = function () {
    return $http.get(simulationsUrl);
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getGenerations = function (params) {
    if(simulation) {
      params['simulation_start'] = simulation;
    }
    return $http.get(generationsUrl, { params: params });
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

  this.getDeathCoordinates = function (params) {
    if(simulation) {
      params['simulation_start'] = simulation;
    }
    return $http.get(deathCoordinatesUrl, { params: params });
  };

  this.getDescendants = function (foramId, params) {
    return $http.get(descendantsUrl(foramId), { params: params });
  }
}]);

/**
 * Created by ezimonczyk on 18/08/15.
 */
'use strict';
