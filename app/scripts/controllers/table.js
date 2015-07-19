/**
 * Created by Eryk on 2015-06-09.
 */

app.controller('TableCtrl',['$location','$scope','$http','DatasetService', function ($location,$scope,$http,DatasetService) {
  $scope.forams = [];

  // currentSet represents our currently selected records with start and stop index
  $scope.currentSet = {start: null,stop: null};

  // reference to our options dropdown
  $scope.optionsWindow = $("#options");

  // code should be used when deployed to PROD - gets forams from API
  //$http.get('https://foram-api.herokuapp.com/forams').success(function(data, status, headers, config) {
    //$scope.forams = data.forams;
  //});

  // mock data used to tests
  $scope.forams = [
    {"id":{"$oid":"55588ef13338610003000000"},"kx":0.1,"ky":0.2,"kz":0.35,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000001"},"kx":0.12,"ky":0.21,"kz":0.32,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000002"},"kx":0.13,"ky":0.22,"kz":0.31,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000003"},"kx":0.14,"ky":0.23,"kz":0.32,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000004"},"kx":0.15,"ky":0.24,"kz":0.33,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000005"},"kx":0.16,"ky":0.25,"kz":0.43,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000006"},"kx":0.17,"ky":0.2,"kz":0.53,"tf":0.4,"phi":0.5,"beta":0.6},
    {"id":{"$oid":"55588ef13338610003000007"},"kx":0.18,"ky":0.72,"kz":0.35,"tf":0.4,"phi":0.5,"beta":0.6}
  ];

  // function which is responsible for selecting events
  $(function() {
    $( "#selectable" ).selectable({
      filter: 'tr',
      start: function(event,ui){
        $scope.currentSet.start = undefined;
        $scope.currentSet.stop = null;
      },
      selected: function(event,ui) {
        var index = parseInt(ui.selected.getAttribute('data-index'));
        if($scope.currentSet.start === undefined){
          $scope.currentSet.start = index;
        }

        if(index > $scope.currentSet.stop || !$scope.currentSet.stop){
          $scope.currentSet.stop = index;
        }
      },
      stop: function(event,ui){
        $scope.optionsWindow.css({
          display: 'block',
          left: (event.clientX)+'px',
          top: (event.clientY)+'px'
        })
      }
    });
  });


  // test function which change view to charts and sends selected data
  $scope.generateChart = function(){
    DatasetService.putProducts($scope.forams.slice($scope.currentSet.start,$scope.currentSet.stop+1));
    $location.path("/charts");
  };

}]);
