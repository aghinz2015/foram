app.controller('3DMapCtrl', ['$scope', 'ForamAPIService', function ($scope, ForamAPIService) {
  var setUp3DColors = function() {
    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });
  }

  var setUpChart = function(chartData) {
    $scope.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,

                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: 'Death map'
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        yAxis: {
            min: 0,
            max: 10,
            title: null
        },
        xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1
        },
        zAxis: {
            min: 0,
            max: 10,
            showFirstLabel: false
        },
        legend: {
            enabled: false
        },
        tooltip: {
          formatter: function() {
            return "Size " + this.point.size;
          }
        },
        series: [{
            name: 'Forams',
            colorByPoint: true,
            data: chartData
        }]
    });
  }

  var addInteractivity = function() {
    $($scope.chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
      eStart = $scope.chart.pointer.normalize(eStart);

      var posX = eStart.pageX,
          posY = eStart.pageY,
          alpha = $scope.chart.options.chart.options3d.alpha,
          beta = $scope.chart.options.chart.options3d.beta,
          newAlpha,
          newBeta,
          sensitivity = 5;

      $(document).bind({
        'mousemove.hc touchdrag.hc': function (e) {
            newBeta = beta + (posX - e.pageX) / sensitivity;
            $scope.chart.options.chart.options3d.beta = newBeta;

            newAlpha = alpha + (e.pageY - posY) / sensitivity;
            $scope.chart.options.chart.options3d.alpha = newAlpha;

            $scope.chart.redraw(false);
        },
        'mouseup touchend': function () {
            $(document).unbind('.hc');
        }
      });
    });
  }

  ForamAPIService.getDeathCoordinates({type: "three_dimensions"}).then(function (response) {
    setUp3DColors();
    setUpChart(response.data.data);
    addInteractivity();
  });

}]);
