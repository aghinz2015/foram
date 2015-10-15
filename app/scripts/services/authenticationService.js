'use strict';

app.service('AuthenticationService', ['$http', '$cookies', '$rootScope','api_host', function($http, $cookies, $rootScope, api_host) {
  this.login = function(email, password) {
    return $http.post(api_host + 'user/login', { user: { email: email, password: password } });
  };

  this.setCredentials = function(email, token) {
    $rootScope.globals = {
      currentUser: {
        email: email,
        token: token
      }
    };

    $http.defaults.headers.common['Authorization'] = 'Token token="' + token + '", email="' + email + '"';
    $cookies.putObject('globals', $rootScope.globals);
  };

  this.logout = function() {
    return $http.delete(api_host + 'user/logout');
  };

  this.clearCredentials = function() {
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  };
}]);
