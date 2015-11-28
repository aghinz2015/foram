app.controller('RegisterCtrl', ['$location', '$scope', 'UserService', 'AuthenticationService', function($location, $scope, UserService, AuthenticationService) {

  $scope.register = function() {
    $scope.dataLoading = true;
    UserService.create($scope.user)
      .then(function(response) {

          AuthenticationService.setCredentials(response.data.user.email, response.data.user.authentication_token);
          $location.path('/');

      }, function(response) {
        $scope.error = response.data;
        $scope.dataLoading = false;
      });
  };
}]);
