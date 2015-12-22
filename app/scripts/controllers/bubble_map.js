app.controller('BubbleMapCtrl', ['$scope', '$routeParams', '$location', 'ForamAPIService', '$window', 'ToastService', function ($scope, $routeParams, $location, ForamAPIService, $window, ToastService) {
  $scope.type = $routeParams.type || "bubble";
  $scope.zAxis = ($scope.type == "bubble") ? "depth" : "time";

  var dividingFactor = 20;

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

    currentZ = minZ;

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

    var clear = d3.select("svg").remove();

    var svg = d3.select("#chart")
                .append("svg")
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
      var interactionEnabled = false;
      var bisect = d3.bisector(function(d) { return d[0]; });
      var currentZ = minZ;

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

      var startArrow = d3.select("#startArrow");
      var fastLeftArrow = d3.select("#fastLeftArrow");
      var leftArrow = d3.select("#leftArrow");
      var rightArrow = d3.select("#rightArrow");
      var fastRightArrow = d3.select("#fastRightArrow");
      var endArrow = d3.select("#endArrow");
      var zInput = d3.select("#zInput");

      svg.transition()
          .duration(30000)
          .ease("linear")
          .tween("z", tweenZ)
          .each("end", enableInteraction);

      startArrow.on("mouseover", enableInteraction);
      fastLeftArrow.on("mouseover", enableInteraction);
      leftArrow.on("mouseover", enableInteraction);
      zInput.on("mouseover", enableInteraction);
      rightArrow.on("mouseover", enableInteraction);
      fastRightArrow.on("mouseover", enableInteraction);
      endArrow.on("mouseover", enableInteraction);

      function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
      }

      function order(a, b) {
        return radius(b) - radius(a);
      }

      function enableInteraction() {
        if (interactionEnabled) {
          return;
        }

        var zScale = d3.scale.linear()
                       .domain([minZ, maxZ])
                       .range([box.x + 10, box.x + box.width - 10])
                       .clamp(true);

        var fastStep = (maxZ - minZ) / 20;
        if (fastStep < 1) {
          fastStep = 1;
        }

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

        function changeCurrentZ(value, propagateToInput) {
          if (propagateToInput === undefined) {
            propagateToInput = true;
          }
          currentZ = value;
          displayZ(value, propagateToInput);
        }

        startArrow.on("click", function() {
          changeCurrentZ(minZ);
        });

        fastLeftArrow.on("click", function() {
          var newValue = currentZ - fastStep;
          if (newValue < minZ) {
            newValue = minZ;
          }
          changeCurrentZ(newValue);
        });

        leftArrow.on("click", function() {
          var newValue = (currentZ == minZ) ? minZ : currentZ - 1;
          changeCurrentZ(newValue);
        });

        zInput.on("input", function() {
          var newValue = this.value;
          if (newValue < minZ) {
            newValue = minZ;
          }
          if (newValue > maxZ) {
            newValue = maxZ;
          }
          changeCurrentZ(newValue, false);
        });

        rightArrow.on("click", function() {
          var newValue = (currentZ == maxZ) ? maxZ : currentZ + 1;
          changeCurrentZ(newValue);
        });

        fastRightArrow.on("click", function() {
          var newValue = currentZ + fastStep;
          if (newValue > maxZ) {
            newValue = maxZ;
          }
          changeCurrentZ(newValue);
        });

        endArrow.on("click", function() {
          changeCurrentZ(maxZ);
        });

        interactionEnabled = true;
      }

      function tweenZ() {
        var z = d3.interpolateNumber(minZ, maxZ);
        return function(t) { displayZ(z(t)); };
      }

      function displayZ(z, propagateToInput) {
        if (propagateToInput === undefined) {
          propagateToInput = true;
        }
        var rounded = Math.round(z);
        currentZ = rounded;
        if (propagateToInput) {
          zInput.property("value", rounded);
        }
        dot.data(interpolateData(z), key).call(position).sort(order);
        label.text(rounded);
      }

      function interpolateData(z) {
        return forams.map(function(d) {
          return {
            name: d.name,
            x: d.x,
            size: interpolateValues(d.size, z),
            y: d.y
          };
        });
      }

      function interpolateValues(values, z) {
        var i = bisect.left(values, z, 0, values.length - 1),
            a = values[i];
        var distance = Math.abs(a[0] - z);
        if (distance > 1) {
          return 0;
        }
        else if (distance == 1) {
          return a[1] * 0.5;
        }
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
