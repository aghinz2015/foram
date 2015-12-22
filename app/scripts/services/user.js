'use strict';

app.service('UserService', ['$http', 'api_host', 'SettingsService', 'ForamAPIService', function($http, api_host, SettingsService, ForamAPIService) {
  var databasesUrl = api_host + 'user/mongo_sessions';
  var databaseUrl = function (id) { return [databasesUrl, id].join('/'); };
  var userUrl = api_host + 'user';
  var settingsUrl = api_host + 'user/settings_set';

  /**
   *
   * @param user
   * @returns {HttpPromise}
     */
  this.create = function(user) {
    return $http.post(userUrl, { user: user });
  };

  /**
   *
   * @returns {HttpPromise}
     */
  this.getUserData = function() {
    return $http.get(userUrl);
  };

  /**
   *
   * @param settings
   * @returns {HttpPromise}
     */
  this.updateUserSettings = function(settings) {
    var settings_data = {
      mappings: {}
    };

    if(settings && settings.mappings) {
      for (var i = 0; i < settings.mappings.length; i++) {
        settings_data.mappings[settings.mappings[i].name] = settings.mappings[i].display;
      }
    }

    settings_data.number_precision = settings.number_precision;
    settings_data.tree_level = settings.tree_level;

    SettingsService.saveSettings(settings_data);

    return $http.patch(settingsUrl,{settings_set: settings_data});
  };

  /**
   *
   * @param data
   * @returns {HttpPromise}
     */
  this.updateUserData = function(data) {
    return $http.patch(userUrl,{user: data});
  };

  /**
   *
   * @returns {HttpPromise}
     */
  this.getDatabases = function() {
    return $http.get(databasesUrl);
  };

  /**
   *
   * @param database
   * @returns {HttpPromise}
     */
  this.updateDatabase = function(database) {
    var data = {
      mongo_session: {
        name: database.name,
        database: database.database,
        hosts: database.hosts,
        username: database.username,
        foram_collection: database.foram_collection,
        active: database.active ? true : false
      }
    };

    if (database.password) data.mongo_session.password = database.password;

    if (database.id) {
      return $http.patch(databaseUrl(database.id), data);
    } else {
      return $http.post(databasesUrl, data);
    }
  };

  /**
   *
   * @param database
   * @returns {HttpPromise}
     */
  this.deleteDatabase = function (database) {
    return $http.delete(databaseUrl(database.id));
  };

  /**
   *
   * @param database
   * @param enable
   * @returns {HttpPromise}
     */
  this.changeDatabaseStatus = function (database, enable) {
    var data = { mongo_session: { active: enable } };
    ForamAPIService.setSimulation(null);
    return $http.patch(databaseUrl(database.id), data);
  }


}]);
