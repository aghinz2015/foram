/**
 * Created by Eryk on 2015-06-09.
 */

app.controller('TableCtrl',['$scope','$http','$q', function ($scope,$http,$q) {
  $scope.forams = [];
  $http.get('https://foram-api.herokuapp.com/forams').success(function(data, status, headers, config) {
    $scope.forams = data.forams;

    $scope.status = status;
    $scope.headers = Object.keys($scope.forams[0]);

  });

  $(function() {
    $( "#selectable" ).selectable({
      filter: 'tr',
      selected: function(event,ui){
        console.log(event);
        console.log(ui);

      }
    });
  });
}]);
