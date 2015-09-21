'use strict';

app.service('UserService', ['$http', 'api_host', function($http, api_host) {
  this.create = function(user) {
    return $http.post(api_host + 'user', { user: user });
  };
}]);
