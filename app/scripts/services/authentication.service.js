'use strict';

app.service('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
  this.login = function(email, password) {
    return $http.post('http://localhost:3000/user/login', { user: { email: email, password: password } })
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

  this.clearCredentials = function() {
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  };
}]);
