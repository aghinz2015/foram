app.controller('LoginCtrl', ['$location', '$scope', 'AuthenticationService', function($location, $scope, AuthenticationService) {
  $scope.init = function() {
    if($scope.globals && $scope.globals.currentUser) {
      $location.path('/');
    }
    // reset login status
    //AuthenticationService.clearCredentials();
  };

  $scope.login = function() {
    $scope.dataLoading = true;
    AuthenticationService.login($scope.email, $scope.password)
      .then(function(response) {
        AuthenticationService.setCredentials(response.data.user.email, response.data.user.authentication_token);
        $location.path('/');
      }, function(response) {
        $scope.error = response.data.error;
        $scope.dataLoading = false;
      });
  };

  $scope.init();
}]);
