'use strict';

app.service('UserService', ['$http', 'appConfig', function($http, appConfig) {
  this.create = function(user) {
    return $http.post(appConfig.apiUserUrl, { user: user });
  };
}]);
