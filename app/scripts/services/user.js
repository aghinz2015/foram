'use strict';

app.service('UserService', ['$http', 'api_host', 'SettingsService', function($http, api_host, SettingsService) {
  this.create = function(user) {
    return $http.post(api_host + 'user', { user: user });
  };

  this.getUserData = function() {
    return $http.get(api_host+'user');
  };

  this.updateUserSettings = function(settings) {
    var settings_data = {
      mappings: {}
    };

    for(var i = 0; i < settings.mappings.length; i++){
      settings_data.mappings[settings.mappings[i].name] = settings.mappings[i].display;
    }

    settings_data.number_precision = settings.number_precision;

    SettingsService.saveSettings(settings_data);

    return $http.patch(api_host+'user/settings_set',{settings_set: settings_data});
  };

  this.updateUserData = function(data) {
    return $http.patch(api_host+'user',{user: data});
  };

  this.getDatabases = function() {
    return $http.get(api_host+'user/mongo_sessions');
  };

  this.updateDatabase = function(database) {
    var data = {
      mongo_session: {
        name: database.name,
        database: database.database,
        hosts: database.hosts,
        username: database.username,
        active: database.active ? true : false
      }
    };

    if (database.password) data.mongo_session.password = database.password;

    if (database.id) {
      return $http.patch(api_host + 'user/mongo_sessions/' + database.id, data);
    } else {
      return $http.post(api_host + 'user/mongo_sessions', data);
    }
  };

  this.deleteDatabase = function (database) {
    return $http.delete(api_host + 'user/mongo_sessions/' + database.id);
  };

  this.changeDatabaseStatus = function (database, enable) {
    var data = { mongo_session: { active: enable } };
    return $http.patch(api_host + 'user/mongo_sessions/' + database.id, data);
  }


}]);
