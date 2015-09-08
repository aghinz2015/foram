'use strict';

app.service('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
  this.login = function(email, password, callback) {
    $http.post('http://localhost:3000/users/login', { user: { email: email, password: password } })
      .success(function(response) {
        callback(response);
      });
  };

  this.setCredentials = function(email, token) {
    $rootScope.globals = {
      currentUser: {
        email: email,
        token: token
      }
    };

    $http.defaults.headers.common['Authorization'] = 'Token token="' + token + '", email="' + email + '"';
    $cookies.put('globals', $rootScope.globals);
  };

  this.clearCredentials = function() {
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  };
}]);
