app.controller('3DMapCtrl', ['$scope', 'ForamAPIService', 'ToastService', function ($scope, ForamAPIService, ToastService) {
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
  };

  var setUpChart = function(data) {
    var chartData = data.data,
        minX = data.x_min,
        maxX = data.x_max,
        minY = data.y_min,
        minZ = data.z_min,
        maxZ = data.z_max,
        maxY = data.y_max;

    $scope.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            height: 800,
            width: 1800,
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
            data: chartData
        }]
    });
  };

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
  };

  var refresh = function() {
    ForamAPIService.getDeathCoordinates({type: "three_dimensions"}).then(function (response) {
      setUpChart(response.data);
      addInteractivity();
    });
  };

  setUp3DColors();
  refresh();


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

  $scope.$watch('simulationStart', function (newValue,oldValue) {
    if(newValue) {
      ForamAPIService.setSimulation(newValue);
      refresh();
    }
  });
}]);
