'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl',['$scope','DatasetService', 'ConfigService', function ($scope, DatasetService, ConfigService) {

  // function which changes current data source
  $scope.changeDataSource = function() {
    $scope.chartConfig.series = [];
    var toBePushed = {data:[], name: "Series 1"};
    $scope.data.forEach(function(entry) {
      toBePushed.name = $scope.currentData;
      toBePushed.data.push(entry[$scope.currentData]);
    });
    $scope.chartConfig.series.push(toBePushed);
  };

  // function to restore default colors
  $scope.restoreDefaultSeriesColor = function() {
    var index = 0;
    var maxIndex = $scope.chartConfig.colors.length - 1;
    $scope.chartConfig.series.forEach(function(entry) {
      entry.color = $scope.chartConfig.colors[index < maxIndex ? index : maxIndex];
      index++;
    });
  };

  // variable responsible for current chart mode
  $scope.chartEditingMode = false;

  // get data from our mock service
  $scope.data = DatasetService.getProducts();

  // watch function to change chartEditingModeStatus depending on chartEditingMode
  $scope.$watch('chartEditingMode', function(){
        $scope.chartEditingModeStatus = $scope.chartEditingMode ? 'Finish' : 'Edit chart';
  });


  // chart configuaration variables
  // #TODO try to make it more readable
  $scope.colors = [];
  $scope.currentData = undefined;
  $scope.chartConfig = {
    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    options: {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        enabled: true
      },
      navigator: {
        enabled: true
      }
    },
    series: [],
    title: {
      text: 'Hello'
    },
    exporting: {
         enabled: true
    }
  };


  // Highcharts stuff
  // #TODO possibly create a JSON config with Highchart theme


  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);


  Highcharts.theme = ConfigService.getHighchartTheme();

// Apply the theme
  Highcharts.setOptions(Highcharts.theme);

}]);

