'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl', ['$scope', '$modal', 'ConfigService', 'ForamAPIService', 'ToastService', function ($scope, $modal, ConfigService, ForamAPIService, ToastService) {

  ////////////////////////    DIALOG    ///////////////////////////

  var modalInstance;
  $scope.loader = true;
  $scope.availableGenes = [];
  $scope.availableGroupingParameters = [];
  $scope.availableGroupingParameters = ["death_hour","age"];

  ForamAPIService.getFiltersAttributes({only_numeric: true}).then(
    function (res) {
      if(res.data) {
        if (res.status < 400) {
          var data = res.data;
          data.attributes.splice(data.attributes.indexOf('death_hour'),1);
          data.attributes.splice(data.attributes.indexOf('age'),1);
          data.attributes.splice(data.attributes.indexOf('chambers_count'),1);
          $scope.availableGenes = data.attributes;
        } else {
          ToastService.showServerToast(res.data,'error',3000);
        }
      }
    }, function (err) {
      ToastService.showToast('Cannot connect to server','error',3000);
    }
  );



  $scope.open = function () {
    modalInstance = $modal.open({
      templateUrl: 'views/gene-selector.html',
      scope: $scope,
      windowClass: 'small'
    });
  };

  ////////////////////////    CHART    ///////////////////////////

  var getChartRef = function () {
    return Highcharts.charts.filter(function (item) {
      return item !== undefined;
    })[0];
  };

  $scope.chartParams = {};
  $scope.chart = {};
  $scope.exportOptions = {};

  var generations;

  ConfigService.getHighchart().then(
    function (res) {
      $scope.chart = res.data.config;
    });

  $scope.createChart = function () {
    modalInstance.close();
    generateChart();
  };

  var pushSeries = function (geneSeries) {
    var chart = getChartRef();
    while (chart.series.length > 0) chart.series[0].remove(true);
    var toBePushed = [];
    for (var key in geneSeries) {
      if (key != "name" && geneSeries.hasOwnProperty(key)) {
        for (var k in geneSeries[key])
          if (geneSeries[key].hasOwnProperty(k)) {
            var serie = null;
            var name = [geneSeries.name, key, k].join("_");
            if (name.indexOf('standard_deviation') > -1) {
              serie = {
                data: [],
                name: name,
                linkedTo: ':previous',
                type: 'arearange',
                fillOpacity: 0.1,
                lineWidth: 0
              };
              for (var i in geneSeries[key].average) {
                serie.data.push([geneSeries[key][k]['minus_standard_deviation'][i], geneSeries[key][k]['plus_standard_deviation'][i]]);
              }
            } else {
              serie = { data: geneSeries[key][k], name: name };
            }
            if (serie) {
              if (!(name.indexOf('effective_') > -1)) {
                serie.visible = false;
              }
              toBePushed.push(serie);
            }
          }
      }
    }
    $scope.chart.series = toBePushed;

  };

  var generateChart = function () {
    $scope.loader = true;
    if (!$scope.chartParams.gene) return;

    var gene = $scope.chartParams.gene.replace(/\s+/g, '');

    var flatParams = {
      start: $scope.chartParams.start,
      stop: $scope.chartParams.stop,
      "genes[]": [
        gene
      ],
      group_by: $scope.chartParams.groupingParameter
    };

    ForamAPIService.getGenerations(flatParams).then(function (res) {
      if(res.data) {
        if (res.status < 400) {
          generations = res.data.result;
          $scope.chart.xAxis.categories = generations.grouping_parameter.values;
          $scope.chart.xAxis.title = {};
          $scope.chart.xAxis.title.text = generations.grouping_parameter.name;
          $scope.chart.xAxis.crosshair = true;
          pushSeries(generations.gene1);
          var title = "Change of attribute " + gene;
          setChartTitle(title);
          var chart = getChartRef();
          chart.redraw();
          $scope.loader = false;
        } else {
          ToastService.showServerToast(res.data,'error',3000);
          $scope.loader = false;
        }
      }
    }, function (err) {
      ToastService.showToast('Cannot connect to server','error',3000);
      $scope.loader = false;
    });
  };

  var setChartTitle = function (title) {
    var chart = getChartRef();
    chart.setTitle({ text: title });
  };


  ////////////////////////    EXPORT   ///////////////////////////

  $scope.export = {};

  ConfigService.getExportOptions().then(
    function (response) {
      $scope.export = response.data.export;
    }
  );

  var options = {
    navigator: {
      enabled: false,
      height: 0,
      baseSeries: undefined,
      outlineWidth: 0,
      margin: 0,
      handles: {
        backgroundColor: 'transparent',
        borderColor: 'transparent'
      },
      xAxis: { labels: { style: { color: 'transparent' } } }
    },
    scrollbar: {
      enabled: true
    },
    rangeSelector: {
      enabled: false,
      inputEnabled: false,
      buttonTheme: {
        visibility: 'hidden'
      },
      labelStyle: {
        visibility: 'hidden'
      }
    },
    tooltip: {
      shared: true,
      formatter: function () {
        var s = generations.grouping_parameter.name + ': ' + this.x + '<br/>';
        s += 'size: ' + generations.grouping_parameter.sizes[this.points[0].point.x] + '<br/>';
        $.each(this.points, function (i, point) {
          s += '<span style="color:' + point.series.color + '">' + point.series.name + '</span>: ';
          if (point.point.low === undefined) {
            s += '<b>' + point.y + '</b><br/>';
          } else {
            s += '<b>' + point.point.low + ' \- ' + point.point.high + '</b><br/>';
          }
        });
        return s;
      }
    },
    exporting: {
      enabled: true,
      chartOptions: {
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        }
      },
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'Save as image',
              onclick: function () {
                modalInstance = $modal.open({
                  templateUrl: 'views/chart_exporter.html',
                  controller: 'ChartExporterCtrl',
                  scope: $scope,
                  windowClass: 'small',
                  resolve: {
                    chartOptions: function () {
                      return $scope.export;
                    }
                  }
                });
              }
            },
            {
              text: 'Print chart',
              onclick: function () {
                this.print()
              },
              seperator: false
            }
          ]
        }
      }
    }
  };

  ////////////////////////    INIT    ///////////////////////////

  $scope.open();



  $scope.$watch('simulationStart', function (newValue,oldValue) {
    if(newValue) {
      ForamAPIService.setSimulation(newValue);
      generateChart();
    }
  });

  // select simulation
  ForamAPIService.getSimulations().then(
    function (res) {
      if(res.data) {
        if (res.status < 400) {
          $scope.availableSimulations = res.data.simulation_starts;
        } else {
          ToastService.showServerToast(res.data,'error',3000);
        }
      }
    }, function (err) {
      ToastService.showToast('Cannot connect to server','error',3000);
    }
  );

  $scope.simulationStart = ForamAPIService.getCurrentSimulation();

  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);

  Highcharts.setOptions(options);

  $scope.loader = false;

}]);
