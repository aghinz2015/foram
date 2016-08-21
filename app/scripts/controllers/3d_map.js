app.controller('3DMapCtrl', ['$scope', 'ForamAPIService', 'ToastService', '$window', function ($scope, ForamAPIService, ToastService, $window) {
  $scope.loader = true;

  var setUp3DColors = function() {
    $scope.loader = true;
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
    $scope.loader = false;
  };

  var setUpChart = function(data) {
    $scope.loader = true;
    var chartData = data.data,
        minX = data.x_min,
        maxX = data.x_max,
        minY = data.y_min,
        minZ = data.z_min,
        maxZ = data.z_max,
        maxY = data.y_max,
        width = $window.innerWidth - 100,
        height = $window.innerHeight - 500;



    $scope.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            height: 800,
            width: width,
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 800,
                viewDistance: 5,

                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: null
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        yAxis: {
            min: minY,
            max: maxY,
            title: null
        },
        xAxis: {
            min: minX,
            max: maxX,
            gridLineWidth: 1
        },
        zAxis: {
            min: minZ,
            max: maxZ,
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
            data: chartData,
            turboThreshold: 0
        }]
    });
    $scope.loader = false;
  };

  var addInteractivity = function() {
    $scope.loader = true;
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
    $scope.loader = false;
  };

  var refresh = function() {
    $scope.loader = true;
    ForamAPIService.getDeathCoordinates({type: "3d"}).then(function (response) {
      setUpChart(response.data);
      addInteractivity();
      $scope.loader = false;
    });
  };

  setUp3DColors();
  refresh();


  // select simulation

  $scope.simulationStart = ForamAPIService.getCurrentSimulation();
}]);
