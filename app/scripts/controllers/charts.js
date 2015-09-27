'use strict';

/**
 * @ngdoc function
 * @name trunkApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the trunkApp
 */

app.controller('ChartsCtrl', ['$scope', 'ConfigService', 'ForamAPIService', 'ngDialog', function ($scope, ConfigService, ForamAPIService, ngDialog) {

  ////////////////////////    DIALOG    ///////////////////////////

  var dialog;
  $scope.availableGenes = [];

  ConfigService.getChartConfig().then(
    function (response) {
      var data = response.data;
      $scope.availableGenes = data.availableGenesParams;

    }, function (response) {
      $scope.openErrorDialog();
    });

  $scope.openDialog = function () {
    dialog = ngDialog.open(
      {
        template: 'views/chart-dialog.html',
        scope: $scope
      });
  };

  $scope.openErrorDialog = function () {
    dialog = ngDialog.open(
      {
        template: 'views/chart-error-dialog.html',
        scope: $scope
      });
  };

  ////////////////////////    CHART    ///////////////////////////

  $scope.chartParams = {};
  $scope.chart = {};
  $scope.exportOptions = {};

  var generations;

  ConfigService.getHighchart().then(
    function (res) {
      $scope.chart = res.data.config;
    },
    function (error) {
      $scope.openErrorDialog();
    });

  $scope.createChart = function () {
    dialog.close();
    generateChart();
  };

  var pushSeries = function (geneSeries) {
    var toBePushed = [];
    for (var key in geneSeries) {
      if (key != "name" && geneSeries.hasOwnProperty(key)) {
        for (var k in geneSeries[key])
          if (geneSeries[key].hasOwnProperty(k)) {
            var serie;
            var name = [geneSeries.name, key, k].join("_");
            if (k == 'standard_deviation') {
              serie = { data: [], name: name, linkedTo: ':previous', type: 'arearange', fillOpacity: 0.1, lineWidth: 0 };
              for (var i in geneSeries[key].average) {
                serie.data.push([geneSeries[key].average[i] - geneSeries[key][k][i], geneSeries[key].average[i] + geneSeries[key][k][i]]);
              }
            } else {
              serie = { data: geneSeries[key][k], name: name };
            }
            toBePushed.push(serie);
          }
      }
    }
    $scope.chart.series = toBePushed;
    for (var i in $scope.chart.series) {
      if (!$scope.chart.series[i].name.indexOf('effective')) {
        $scope.chart.series[i].hide();
      }
    }
  };

  var generateChart = function () {
    if ($scope.chartParams.gene1 || $scope.chartParams.gene2) {

      var gene1 = $scope.chartParams.gene1.replace(/\s+/g, '');

      var flatParams = {
        start: $scope.chartParams.start,
        stop: $scope.chartParams.stop,
        "genes[]": [
          gene1
        ]
      };

      if ($scope.chartParams.gene2) {
        var gene2 = $scope.chartParams.gene1.replace(/\s+/g, '');
        flatParams["genes[]"].push(gene2);
      }
      ForamAPIService.getGenerations(flatParams).then(function (response) {
        $scope.chartParams = {};
        generations = response.data.result;

        $scope.chart.xAxis.categories = generations.grouping_parameter.values;
        $scope.chart.xAxis.title = {};
        $scope.chart.xAxis.title.text = generations.grouping_parameter.name;
        $scope.chart.xAxis.crosshair = true;


        pushSeries(generations.gene1);
        if (generations.gene2) {
          pushSeries(generations.gene2);
        }
      }, function (error) {
        $scope.openErrorDialog();
      });
    }
  };

  ////////////////////////    EXPORT   ///////////////////////////

  $scope.export = {};

  ConfigService.getExportOptions().then(
    function (response) {
      $scope.export = response.data.export;
    },
    function (error) {
      $scope.openErrorDialog();
    });

  var setAllSeriesToOneColor = function (series, color) {
    var previousColors = [];
    for (var i = 0; i < series.length; i++) {
      previousColors.push(series[i].color);
      series[i].update({ color: color, fillOpacity: series[i].fillOpacity });
    }
    return previousColors;
  }

  var updateSeriesColors = function (series, colorList) {
    for (var i = 0; i < series.length; i++) {
      var index = Math.min(i, colorList.length - 1);
      var opacity = getSerieTypeOpacity(series[i]);
      series[i].update({ color: colorList[index], fillOpacity: opacity });
    }
  }

  var getSerieTypeOpacity = function (serie) {
    return serie.type === 'line' ? 1 : 0.2;
  }

  var blackAndWhiteExport = function (exportType) {
    var chart = Highcharts.charts.filter(function (item) {
      return item !== undefined;
    })[0];
    var series = chart.series;
    var previousColors = setAllSeriesToOneColor(series, '#000000');
    chart.exportChart(exportType, $scope.export.blackAndWhite);
    updateSeriesColors(series, previousColors);
  };

  var blackAndWhitePngExport = function () {
    blackAndWhiteExport($scope.export.pngExport);
  };

  var blackAndWhiteJpegExport = function () {
    blackAndWhiteExport($scope.export.jpegExport)
  }

  var blackAndWhitePdfExport = function () {
    blackAndWhiteExport($scope.export.pdfExport);
  }

  var blackAndWhiteSvgExport = function () {
    blackAndWhiteExport($scope.export.svgExport);
  }

  var options = {
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'Export to PNG (Black&White)',
              onclick: blackAndWhitePngExport
            },
            {
              text: 'Export to PNG (Color)',
              onclick: function () {
                this.exportChart($scope.export.pngExport, $scope.export.color);
              },
              separator: false
            },
            {
              text: 'Export to JPEG (Black&White)',
              onclick: blackAndWhiteJpegExport
            },
            {
              text: 'Export to JPEG (Color)',
              onclick: function () {
                this.exportChart($scope.export.jpegExport, $scope.export.color);
              },
              separator: false
            },
            {
              text: 'Export to PDF (Black&White)',
              onclick: blackAndWhitePdfExport,
              separator: false
            },
            {
              text: 'Export to PDF (Color)',
              onclick: function () {
                this.exportChart($scope.export.pdfExport, $scope.export.color);
              },
              separator: false
            },
            {
              text: 'Export to SVG (Black&White)',
              onclick: blackAndWhiteSvgExport,
              separator: false
            },
            {
              text: 'Export to SVG (Color)',
              onclick: function () {
                this.exportChart($scope.export.svgExport, $scope.export.color);
              },
              separator: false
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
      },
    }
  };

  ////////////////////////    INIT    ///////////////////////////

  $scope.openDialog();

  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);

  Highcharts.setOptions(options);

}]);
