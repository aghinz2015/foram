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
  this.getGenerations = function(params) {
    return $http.get(appConfig.apiGenerationsUrl,{params: params});
  };

  /**
   *
   * @param params
   * @returns {HttpPromise}
   */
  this.getForamsInfo = function(params) {
    return $http.head(appConfig.apiForamsUrl, {params: params});
  }

  /**
   * @returns {HttpPromise} Promise with data about MongoSessions (databases) for current user
   */
  this.getDatabases = function() {
    return $http.get(appConfig.apiDatabasesUrl);
  }

  /**
   * @databaseId {String} ID of the MongoSession (database) which status will be altered
   * @enable {boolean} True when enabling MongoSession, false otherwise
   * @returns {HttpPromise} Promise with result of the status change
   */
  this.changeDatabaseStatus = function (databaseId, enable) {
    var data = { mongo_session: { active: enable } };
    return $http.patch(appConfig.apiDatabasesUrl + '/' + databaseId, data);
  }
}]);

