'use strict';

app.service('UserService', ['$http', function($http) {
  this.create = function(user) {
    return $http.post('http://localhost:3000/user', { user: user });
  };
}]);
