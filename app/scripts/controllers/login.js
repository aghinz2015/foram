app.controller('LoginCtrl', ['$location', '$scope', 'AuthenticationService', 'ToastService', function($location, $scope, AuthenticationService, ToastService) {
  $scope.loader = false;

  var init = function() {
    if($scope.globals && $scope.globals.currentUser) {
      $location.path('/');
    }
  };

  $scope.login = function() {
    $scope.loader = true;
    AuthenticationService.login($scope.email, $scope.password)
      .then(function(res) {
        if(res.data) {
          if (res.status < 400) {
            AuthenticationService.setCredentials(res.data.user.email, res.data.user.authentication_token);
            $location.path('/table');
            $scope.loader = false;
          } else {
            $scope.loader = false;
            ToastService.showServerToast(res.data,'error',3000);
          }
        }
      }, function(err) {
        $scope.loader = false;
        ToastService.showToast('Cannot connect to server','error',3000);
      });
  };

  init();
}]);
