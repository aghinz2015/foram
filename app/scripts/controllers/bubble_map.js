app.controller('BubbleMapCtrl', ['$scope', '$routeParams', '$location', 'ForamAPIService', '$window', 'ToastService', function ($scope, $routeParams, $location, ForamAPIService, $window, ToastService) {
  $scope.type = $routeParams.type || "bubble";
  $scope.zAxis = ($scope.type == "bubble") ? "depth" : "time";

    $scope.changeTypeText = function() {
    var result = "Group by ";
    if ($scope.type == "bubble") {
      return result + "death time";
    } else {
      return  result + "depth"
    }
  };

  $scope.currentTypeText = function() {
    var result = "Currently grouped by ";
    if ($scope.type == "bubble") {
      return result + "depth";
    } else {
      return  result + "death time";
    }
  };


  $scope.swapType = function() {
    if ($scope.type == "bubble") {
      $scope.type = "bubble_alternative";
    } else {
      $scope.type = "bubble";
    }

    $location.path("/bubble-map/" + $scope.type);
  };

  function x(d) { return d.x; }
  function y(d) { return d.y; }
  function radius(d) { return d.size; }
  function key(d) { return d.name; }
  function color(d) { return d.x * d.y; }

  var prepareChart = function(data) {
    var minZ = data.z_min,
        maxZ = data.z_max,
        maxX = data.x_max,
        minX = data.x_min,
        maxY = data.y_max,
        minY = data.y_min;

    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 80.5},
        width = $window.innerWidth - 220 - margin.right,
        height = $window.innerHeight - 200 - margin.top - margin.bottom;

    //TODO - consider scaling by values from data
    var xScale = d3.scale.linear().domain([minX-1, maxX+1]).range([0, width]),
        yScale = d3.scale.linear().domain([minY-1, maxY+1]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([0, 50]).range([0, 40]),
        colorScale = d3.scale.category10();

    var xAxis = d3.svg.axis().orient("bottom").scale(xScale),
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("x coordinate");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("y coordinate");

    var label = svg.append("text")
                   .attr("class", "z label")
                   .attr("text-anchor", "end")
                   .attr("y", height - 24)
                   .attr("x", width)
                   .text(minZ);

    var plotChart = function(forams) {
      var bisect = d3.bisector(function(d) { return d[0]; });

      var dot = svg.append("g")
                   .attr("class", "dots")
                   .selectAll(".dot")
                   .data(interpolateData(minZ))
                   .enter().append("circle")
                   .attr("class", "dot")
                   .style("fill", function(d) { return colorScale(color(d)); })
                   .call(position)
                   .sort(order);

      dot.append("title")
         .text(function(d) { return d.name; });

      var box = label.node().getBBox();

      var overlay = svg.append("rect")
                       .attr("class", "overlay")
                       .attr("x", box.x)
                       .attr("y", box.y)
                       .attr("width", box.width)
                       .attr("height", box.height)
                       .on("mouseover", enableInteraction);

      svg.transition()
          .duration(30000)
          .ease("linear")
          .tween("z", tweenZ)
          .each("end", enableInteraction);

      function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
      }

      function order(a, b) {
        return radius(b) - radius(a);
      }

      function enableInteraction() {
        var zScale = d3.scale.linear()
                       .domain([minZ, maxZ])
                       .range([box.x + 10, box.x + box.width - 10])
                       .clamp(true);

        svg.transition().duration(0);

        overlay.on("mouseover", mouseover)
               .on("mouseout",  mouseout)
               .on("mousemove", mousemove)
               .on("touchmove", mousemove);

        function mouseover() {
          label.classed("active", true);
        }

        function mouseout() {
          label.classed("active", false);
        }

        function mousemove() {
          displayZ(zScale.invert(d3.mouse(this)[0]));
        }
      }

      function tweenZ() {
        var z = d3.interpolateNumber(minZ, maxZ);
        return function(t) { displayZ(z(t)); };
      }

      function displayZ(z) {
        dot.data(interpolateData(z), key).call(position).sort(order);
        label.text(Math.round(z));
      }

      function interpolateData(z) {
        return forams.map(function(d) {
          return {
            name: d.name,
            x: interpolateValues(d.x, z),
            size: interpolateValues(d.size, z),
            y: interpolateValues(d.y, z)
          };
        });
      }

      function interpolateValues(values, z) {
        var i = bisect.left(values, z, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
          var b = values[i - 1],
              t = (z - a[0]) / (b[0] - a[0]);
          return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
      }
    };

    plotChart(data.data);
  };

  var refresh = function() {
    ForamAPIService.getDeathCoordinates({ type: $scope.type})
      .then(
        function (res) {
          prepareChart(res.data)
        },
        function(err){
          console.log(err);
        }
      )
  };

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