'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl',['$scope', 'ConfigService', 'ForamAPIService', 'ngDialog', function ($scope, ConfigService, ForamAPIService, ngDialog) {

  ////////////////////////    DIALOG    ///////////////////////////

  var dialog;
  $scope.availableGenes = [];

  ConfigService.getChartConfig().then(
    function(response){
      var data = response.data;
      $scope.availableGenes = data.availableGenesParams;
    },function(response){
      console.log('GetChartConfig::Error - ',response.status);
    });

  $scope.openDialog = function () {
    dialog = ngDialog.open(
      {
        template: 'views/chart-dialog.html',
        scope: $scope
      });
  };

  ////////////////////////    CHART    ///////////////////////////

  $scope.chartParams = {};
  $scope.chart = {};

  var generations;

  ConfigService.getHighchart()
    .then(
    function(res){
      $scope.chart = res.data.config;
    },
    function(error){
      console.log('getHighchart::Error - ',error);
    });

  $scope.createChart = function() {
    dialog.close();
    generateChart();
  };

  var pushSeries = function(geneSeries){
    var toBePushed = [];
    for (var key in geneSeries) {
      if (key != "name" && geneSeries.hasOwnProperty(key)) {
        for(var k in geneSeries[key])
        if(geneSeries[key].hasOwnProperty(k)) {
          var serie;
          if(k == 'standard_deviation'){
            serie =  { data: [], name: geneSeries.name+"_"+key+"_"+k, linkedTo: ':previous', type: 'arearange', fillOpacity: 0.1, lineWidth: 0 };
            for(var i in geneSeries[key].average){
              serie.data.push([geneSeries[key].average[i]-geneSeries[key][k][i],geneSeries[key].average[i]+geneSeries[key][k][i]]);
            }
          } else {
            serie = {data: geneSeries[key][k], name: geneSeries.name+"_"+key+"_"+k};
          }

          toBePushed.push(serie);
        }
      }
    }
    $scope.chart.series = toBePushed;
    for(var i in $scope.chart.series){
      if(!$scope.chart.series[i].name.indexOf('effective')){
        $scope.chart.series[i].hide();
      }
    }
  };

  var generateChart = function() {
    if($scope.chartParams.gene1 || $scope.chartParams.gene2) {

      var flatParams = {
        start: $scope.chartParams.start,
        stop: $scope.chartParams.stop,
        "genes[]": [
          $scope.chartParams.gene1,
          $scope.chartParams.gene2
        ].filter(function(e){return e})
      };
      ForamAPIService.getGenerations(flatParams)
        .then(function (response) {
          console.log(response.data.result);
          $scope.chartParams = {};
          generations = response.data.result;

          $scope.chart.xAxis.categories = generations.grouping_parameter.values;
          $scope.chart.xAxis.title = {};
          $scope.chart.xAxis.title.text = generations.grouping_parameter.name;
          $scope.chart.xAxis.crosshair = true;





          pushSeries(generations.gene1);
          if (generations.gene2) {
            pushSeries(generations.gene2,1);
          }
        }, function (error) {
          console.log("generateChart::Error - ", error);
        });
    }


  };



  ////////////////////////    INIT    ///////////////////////////

  $scope.openDialog();



/*

  $scope.currentData = undefined;

  // watch function to change chartEditingModeStatus depending on chartEditingMode
  $scope.$watch('chartEditingMode', function () {
    $scope.chartEditingModeStatus = $scope.chartEditingMode ? 'up' : 'down';
  });

  $scope.$watch('currentColor', function() {
    if($scope.currentSerie)
      $scope.chart.series[$scope.currentSerie].color = $scope.currentColor;
  });


  $scope.$watch('currentSerie', function() {
    if($scope.currentSerie)
      $scope.currentColor = $scope.chart.series[$scope.currentSerie].color;
  });

  // chart configuaration variables
  // #TODO try to make it more readable

  // variable responsible for current chart mode
  $scope.chartEditingMode = false;



  // function to restore default colors
  $scope.restoreDefaultSeriesColor = function () {
    var i;
    var index = 0;
    var maxIndex = $scope.chart.colors.length - 1;
    $scope.chart.series.forEach(function (entry) {
      i = Math.min(entry.linkedTo === ":previous" ? index - 1 : index, maxIndex);
      entry.color = $scope.chart.colors[i];
      index++;
    });
  };

*/
  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);




// Apply the theme


}]);

