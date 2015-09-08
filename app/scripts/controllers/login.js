app.controller('LoginCtrl', ['$location', '$scope', 'AuthenticationService', function($location, $scope, AuthenticationService) {
  //var vm = this;

  //(function initController() {
  //  // reset login status
  //  AuthenticationService.clearCredentials();
  //})();

  $scope.login = function() {
    $scope.dataLoading = true;
    AuthenticationService.login($scope.email, $scope.password, function(response) {
      if(response.success) {
        AuthenticationService.setCredentials(response.user.email, response.user.token);
        $location.path('/');
      } else {
        //FlashService.Error(response.status);
        $scope.dataLoading = false;
      }
    });
  };
}]);
