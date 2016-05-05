'use strict';

app.service('ForamAPIService', ['$http', 'api_host', 'DatasetService', function ($http, api_host, DatasetService) {

  var foramsUrl = api_host + 'forams',
      attributesUrl = api_host + 'forams/attribute_names',
      filtersAttributesUrl = api_host + 'foram_filters/attribute_names',
      attributeStatsUrl = api_host + 'forams/attribute_stats',
      simulationsUrl = api_host + 'forams/simulation_starts',
      generationsUrl = api_host + 'generations',
      databasesUrl = api_host + 'user/mongo_sessions',
      deathCoordinatesUrl = api_host + 'death_coordinates',
      databaseUrl = function (id) { return [databasesUrl, id].join('/');},
      descendantsUrl = function(foramId) { return foramsUrl + '/' + foramId + '/descendants';},
      childrenCountUrl = function(foramId) { return foramsUrl + '/' + foramId + '/children_count' ;},
      simulation = DatasetService.getProducts('foram-simulation');

  /**
   *
   * @param params
     */
  var addFilters = function(params){
    var filters = DatasetService.getProducts("foram-filters");
    if(filters) {
      var keys = Object.keys(filters);
      for(var i = 0; i < keys.length; i++){
        params[keys[i]] = filters[keys[i]];
      }
    }

    return params;
  };

  /**
   *
   * @param simulation_id
     */
  this.setSimulation = function(simulation_id) {
    DatasetService.putProducts(simulation_id,'foram-simulation');
    simulation = simulation_id;
  };

  this.getCurrentSimulation = function() {
    console.log(simulation);
    return simulation;
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForams = function (params, format) {
    if(!params) {
      params = {};
    }
    if (format === undefined) {
      format = '';
    }
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
  this.getFiltersAttributes = function (params) {
    return $http.get(filtersAttributesUrl,{params: params});
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

    params = addFilters(params);

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

  this.updateFilters = function(id, params) {
    return $http.put(api_host + "foram_filters/" + id, {foram_filter: params});
  };


  this.getDeathCoordinates = function (params) {
    if(simulation) {
      params['simulation_start'] = simulation;
    }

    params = addFilters(params);

    return $http.get(deathCoordinatesUrl, { params: params });
  };

  this.getDescendants = function (foramId, params) {
    return $http.get(descendantsUrl(foramId), { params: params });
  };

  this.getAttributeStats = function (params) {
    return $http.get(attributeStatsUrl, {params : params});
  };

  this.getChildrenCount = function(foramId, params) {
    return $http.get(childrenCountUrl(foramId), { params: params });
  }
}]);


