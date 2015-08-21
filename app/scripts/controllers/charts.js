'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl', ['$scope', '$http', 'DatasetService', function ($scope, $http, DatasetService) {

  // function which changes current data source
  $scope.changePresentedAttribute = function () {
    $scope.chartConfig.title.text = "Change of attribute " + $scope.currentData;
    $scope.chartConfig.series = [];
    $scope.chartConfig.xAxis = { categories: [] };
    $scope.chartConfig.xAxis.categories = Object.keys($scope.generations);
    var subAttributes = Object.keys($scope.generations[Object.keys($scope.generations)[0]]
      .attributes[$scope.currentData]);
    for (var i in subAttributes) {
      if (subAttributes[i] != "standard_deviation") pushSeriesData(subAttributes[i], $scope.chartConfig.colors[i]);
      else pushStandardDeviation("standard_deviation", $scope.chartConfig.colors[i - 1]);
    };
  };
  var pushSeriesData = function (value, color) {
    var toBePushed = { data: [], name: value, color: color };
    for (var key in $scope.generations) {
      if (key != "global_averages") {
        toBePushed.data.push($scope.generations[key].attributes[$scope.currentData][value]);
      }
    };
    $scope.chartConfig.series.push(toBePushed);
  };
  var pushStandardDeviation = function (value, color) {
    var toBePushed = { data: [], name: value, linkedTo: ':previous', type: 'arearange', color: color, fillOpacity: 0.2, lineWidth: 0 };
    for (var key in $scope.generations) {
      if (key != "global_averages") {
        var standardDeviation = $scope.generations[key].attributes[$scope.currentData][value];
        var average = $scope.generations[key].attributes[$scope.currentData].average;
        toBePushed.data.push([average - standardDeviation, average + standardDeviation]);
      }
    };
    $scope.chartConfig.series.push(toBePushed);

  };
  // function to restore default colors
  $scope.restoreDefaultSeriesColor = function () {
    var i;
    var index = 0;
    var maxIndex = $scope.chartConfig.colors.length - 1;
    $scope.chartConfig.series.forEach(function (entry) {
      i = Math.min(entry.linkedTo === ":previous" ? index - 1 : index, maxIndex);
      entry.color = $scope.chartConfig.colors[i];
      index++;
    });
  };

  // variable responsible for current chart mode
  $scope.chartEditingMode = false;

  // get data from API
  // #TODO push address to configuration file
  $http.get('localhost:3000/generations').success(function (data, status, headers, config) {
    $scope.generations = data.generations;
    $scope.attributesList = $scope.generations[Object.keys($scope.generations)[0]].attributes;
  });

  // watch function to change chartEditingModeStatus depending on chartEditingMode
  $scope.$watch('chartEditingMode', function () {
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
      text: ''
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


  Highcharts.theme = {
    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#2a2a2b'],
          [1, '#3e3e40']
        ]
      },
      style: {
        fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
    },
    title: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase',
        fontSize: '20px'
      }
    },
    subtitle: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase'
      }
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'

        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },

    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },

    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    },

    // scroll charts
    rangeSelector: {
      buttonTheme: {
        fill: '#505053',
        stroke: '#000000',
        style: {
          color: '#CCC'
        },
        states: {
          hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          },
          select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          }
        }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
        backgroundColor: '#333',
        color: 'silver'
      },
      labelStyle: {
        color: 'silver'
      }
    },

    navigator: {
      handles: {
        backgroundColor: '#666',
        borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
        color: '#7798BF',
        lineColor: '#A6C7ED'
      },
      xAxis: {
        gridLineColor: '#505053'
      }
    },

    scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

}]);

