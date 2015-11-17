'use strict';

app.service('UserService', ['$http', 'api_host', function($http, api_host) {
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

    return $http.patch(api_host+'user/settings_set',{settings_set: settings_data});
  };

  this.updateUserData = function(data) {

    return $http.patch(api_host+'user',{user: data});

  };

  this.getDatabases = function() {
    return $http.get(api_host+'user/mongo_sessions');
  };


}]);
