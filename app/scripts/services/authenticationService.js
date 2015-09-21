'use strict';

app.service('AuthenticationService', ['$http', '$cookies', '$rootScope','appConfig', function($http, $cookies, $rootScope, appConfig) {
  this.login = function(email, password) {
    return $http.post(appConfig.apiUserUrl + '/login', { user: { email: email, password: password } });
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
    return $http.delete(appConfig.apiUserUrl + '/logout');
  };

  this.clearCredentials = function() {
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  };
}]);
