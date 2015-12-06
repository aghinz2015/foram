app.controller('RegisterCtrl', ['$location', '$scope', 'UserService', 'AuthenticationService', 'ToastService', function($location, $scope, UserService, AuthenticationService, ToastService) {
  $scope.loader = false;

  $scope.register = function() {
    $scope.loader = true;
    UserService.create($scope.user)
      .then(function(res) {
        if(res.data) {
          if (res.status < 400) {
            AuthenticationService.setCredentials(res.data.user.email, res.data.user.authentication_token);
            $scope.loader = false;
            $location.path('/table');
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
}]);
