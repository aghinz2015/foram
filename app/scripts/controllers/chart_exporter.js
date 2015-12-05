'use strict';

app.controller('ChartExporterCtrl', function ($scope, $modalInstance, chartOptions) {
  
  $scope.chartOptions = chartOptions;
  var getChartRef = function () {
    return Highcharts.charts.filter(function (item) {
      return item !== undefined;
    })[0];
  };
  
  $scope.exportOptions = { type: 'image/png', filename: 'chart' };
  $scope.grayScale = {value: false};

  $scope.download = function () {
    exportChart($scope.exportOptions, $scope.grayScale.value);
    $modalInstance.close();
  };
  
  var exportChart = function (exportOptions, grayScale) {
    if(grayScale) blackAndWhiteExport(exportOptions);
    else {
      var chart = getChartRef();
      chart.exportChart(exportOptions, $scope.chartOptions.color);
    }   
  };
  
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

  var blackAndWhiteExport = function (exportOptions) {
    var chart = getChartRef();
    var series = chart.series;
    var previousColors = setAllSeriesToGrayScale(series);
    chart.exportChart(exportOptions, $scope.chartOptions.blackAndWhite);
    updateSeriesColors(series, previousColors);
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
