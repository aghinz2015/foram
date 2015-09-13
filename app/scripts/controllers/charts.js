'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl',['$scope','DatasetService', 'ConfigService', 'ForamAPIService', function ($scope, DatasetService, ConfigService) {


  $scope.chart = {};
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
  $scope.colors = [];


  // variable responsible for current chart mode
  $scope.chartEditingMode = false;

  // get data from our mock service
  $scope.data = DatasetService.getProducts();

  ConfigService.getHighchart()
    .then(
    function(res){
      $scope.chart = res.data.config;
      //Highcharts.theme = res.data.theme;
      //Highcharts.setOptions(Highcharts.theme)
    },
    function(error){
      throw error.status+" : "+error.statusText;
    });
  //var data = ForamAPIService.getAllForams();

  var data = {
    "generations":
    {
      "15":
      {
        "attributes":
        {
          "x":
          {
            "min": 4,
            "max": 7,
            "average": 5.75,
            "standard_deviation": 1.09
          },
          "y":
          {
            "min": 1,
            "max": 7,
            "average": 4.75,
            "standard_deviation": 2.28
          },
          "z":
          {
            "min": 1,
            "max": 8,
            "average": 5.0,
            "standard_deviation": 2.74
          },
          "age":
          {
            "min": 15,
            "max": 15,
            "average": 15.0,
            "standard_deviation": 0.0
          }
        },
        "size": 4
      },
      "16":
      {
        "attributes":
        {
          "x":
          {
            "min": 4,
            "max": 7,
            "average": 5.76,
            "standard_deviation": 1.09
          },
          "y":
          {
            "min": 1,
            "max": 7,
            "average": 4.75,
            "standard_deviation": 2.28
          },
          "z":
          {
            "min": 1,
            "max": 8,
            "average": 5.0,
            "standard_deviation": 2.74
          },
          "age":
          {
            "min": 15,
            "max": 15,
            "average": 15.0,
            "standard_deviation": 0.0
          }
        },
        "size": 4
      },
      "global_averages": {
        "x": 4.61,
        "y": 4.56,
        "z": 4.58,
        "age": 9.87
      }
    },
    "attributes": [
      "x",
      "y",
      "z",
      "age"
    ],
    "subAttributes": [
      "min",
      "max",
      "average",
      "standard_deviation"
    ]

  };

  $scope.generations = data.generations;
  $scope.attributes = data.attributes;
  $scope.subAttributes = data.subAttributes;


  // function which changes current data source
  $scope.changePresentedAttribute = function (current) {
    $scope.chart.title.text = "Change of attribute " + data.attributes[$scope.currentData];
    $scope.chart.series = [];
    $scope.chart.xAxis = { categories: Object.keys(data.generations) };

    for (var i in data.subAttributes) {
      if (data.subAttributes[i] != "standard_deviation")
        pushSeriesData(data.subAttributes[i], $scope.chart.colors[i]);
      else
        pushStandardDeviation("standard_deviation", $scope.chart.colors[i - 1]);
    }
  };

  var pushSeriesData = function (value, color) {
    var toBePushed = { data: [], name: value, color: color };
    for (var key in $scope.generations) {
      if (key != "global_averages") {
        console.log($scope.currentData);
        console.log();
        toBePushed.data.push($scope.generations[key].attributes[$scope.attributes[$scope.currentData]][value]);
      }
    }
    $scope.chart.series.push(toBePushed);
  };


  var pushStandardDeviation = function (value, color) {
    var toBePushed = { data: [], name: value, linkedTo: ':previous', type: 'arearange', color: color, fillOpacity: 0.2, lineWidth: 0 };
    for (var key in $scope.generations) {
      if (key != "global_averages") {
        var standardDeviation = $scope.generations[key].attributes[$scope.attributes[$scope.currentData]].standard_deviation;
        var average = $scope.generations[key].attributes[$scope.attributes[$scope.currentData]].average;
        toBePushed.data.push([average - standardDeviation, average + standardDeviation]);
      }
    };
    $scope.chart.series.push(toBePushed);

  };

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


  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);




// Apply the theme


}]);

