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
  var groupSize = {};

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
    var dev_flag = true;
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
            if(serie) {
              if (!(name.indexOf('effective') > -1)) {
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
        
        for(var i = 0; i < generations.grouping_parameter.values.length; i++) {
          groupSize[generations.grouping_parameter.values[i]] = generations.grouping_parameter.sizes[i];
        }
        
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

  var getRgbFromHex = function (hexColor) {
    return {
      r: parseInt(hexColor.substring(1, 3), 16),
      g: parseInt(hexColor.substring(3, 5), 16),
      b: parseInt(hexColor.substring(5, 7), 16)
    }
  };

  var componentToHex = function (component) {
    var hex = component.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  var rgbToHex = function (rgbColor) {
    return "#" + componentToHex(rgbColor.r) + componentToHex(rgbColor.g) + componentToHex(rgbColor.b);
  };

  var getGrayScaleColor = function (hexColor) {
    var rgbColor = getRgbFromHex(hexColor);
    var grayScale = Math.round(rgbColor.r * 0.21 + rgbColor.g * 0.72 + rgbColor.b * 0.07);
    var grayScaleRgbColor = { r: grayScale, g: grayScale, b: grayScale };
    return rgbToHex(grayScaleRgbColor);
  };

  ConfigService.getExportOptions().then(
    function (response) {
      $scope.export = response.data.export;
    },
    function (error) {
      $scope.openErrorDialog();
    });

  var setAllSeriesToGrayScale = function (series) {
    var previousColors = [];
    for (var i = 0; i < series.length; i++) {
      previousColors.push(series[i].color);
      var grayScaleColor = getGrayScaleColor(series[i].color);
      series[i].update({ color: grayScaleColor, fillOpacity: 0.2 });
    }
    return previousColors;
  };



  var updateSeriesColors = function (series, colorList) {
    for (var i = 0; i < series.length; i++) {
      var index = Math.min(i, colorList.length - 1);
      var opacity = getSerieTypeOpacity(series[i]);
      series[i].update({ color: colorList[index], fillOpacity: opacity });
    }
  };

  var getSerieTypeOpacity = function (serie) {
    return serie.type === 'line' ? 1 : 0.2;
  };

  var blackAndWhiteExport = function (exportType) {
    var chart = Highcharts.charts.filter(function (item) {
      return item !== undefined;
    })[0];
    var series = chart.series;
    var previousColors = setAllSeriesToGrayScale(series);
    chart.exportChart(exportType, $scope.export.blackAndWhite);
    updateSeriesColors(series, previousColors);
  };

  var blackAndWhitePngExport = function () {
    blackAndWhiteExport($scope.export.pngExport);
  };

  var blackAndWhiteJpegExport = function () {
    blackAndWhiteExport($scope.export.jpegExport)
  };

  var blackAndWhitePdfExport = function () {
    blackAndWhiteExport($scope.export.pdfExport);
  };

  var blackAndWhiteSvgExport = function () {
    blackAndWhiteExport($scope.export.svgExport);
  };

  var options = {
    tooltip : {
          shared: true,
          formatter: function() {
            var s = this.x + '<br/>';
            $.each(this.points, function(i, point) {
              s += '<span style="color:'+point.series.color+'">'+point.series.name+'</span>: ';
              if(point.point.low === undefined) {
                 s += '<b>'+point.y+'</b><br/>';
              } else {
                s += '<b>'+point.point.low + ' \- ' + point.point.high + '</b><br/>';
              }  
            });
            s += 'Size: ' + groupSize[this.x]; 
            return s;
          }
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'Export to PNG (Grayscale)',
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
              text: 'Export to JPEG (Grayscale)',
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
              text: 'Export to PDF (Grayscale)',
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
              text: 'Export to SVG (Grayscale)',
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
      }
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
