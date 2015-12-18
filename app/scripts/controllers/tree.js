app.controller('TreeCtrl', ['$scope', '$window', 'ForamAPIService', 'SimulationFactory', '$location', function ($scope, $window, ForamAPIService, simulationFactory, $location) {

  var searchObject = $location.search();

  var foramId = searchObject.foramId,
      level = searchObject.level;


  $scope.goToVisualization = function() {
     var newWindow = $window.open("/#/visualization");
     newWindow._foram = {
       genotype: $scope.genotype,
       chambersCount: $scope.chambers_count
     };
  };

  var addTooltipClearing = function() {
    var div = d3.select("#tree-tooltip");
    $("#tree-tooltip").mouseenter(function(){
      clearTimeout($(this).data('timeoutId'));
    }).mouseleave(function(){
        var element = $(this),
            timeoutId = setTimeout(function(){
                div .style("opacity", 0)
                    .style("left", (-100) + "px")
                    .style("top", (-100) + "px");
            }, 250);
        element.data('timeoutId', timeoutId);
    });
  }

  var prepareTree = function(data) {
    var margin = {top: 20, right: 120, bottom: 20, left: 200},
        width = 2000 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var labelText = function(foram) {
      var genotype = foram.genotype;
      var parameters = [ genotype.translation_factor[0],
                         genotype.growth_factor[0],
                         genotype.deviation_angle[0],
                         genotype.rotation_angle[0]
                       ];
      for (var i = 0 ; i < parameters.length ; i++) {
        parameters[i] = (Math.round(Number(parameters[i]) * 100) / 100).toString();
      }
      return parameters.join(" ; ");
    }

    var tooltipText = function(foram) {
      var genotype = foram.genotype;
      var parameters = [ genotype.translation_factor[0],
                         genotype.growth_factor[0],
                         genotype.deviation_angle[0],
                         genotype.rotation_angle[0]
                       ];
      for (var i = 0 ; i < parameters.length ; i++) {
        parameters[i] = (Math.round(Number(parameters[i]) * 100) / 100).toString();
      }

      return "<p>Translation factor: " + parameters[0] + "</p>" +
             "<p>Growth factor: " + parameters[1] + "</p>" +
             "<p>Deviation angle: " + parameters[2] + "</p>" +
             "<p>Rotation angle: " + parameters[3] + "</p>";
    }

    var i = 0,
        duration = 750,
        root;

    var div = d3.select("#tree-tooltip");
    var tooltipTextBox = d3.select("#tooltip-params");

    var tree = d3.layout.tree()
                 .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("#container").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var element = document.getElementById('tooltip-visualization');
    var simulation = simulationFactory(element);

    var normalizeGenotype = function(genotype) {
      return {
        translationFactor: genotype.translation_factor[0],
        growthFactor:      genotype.growth_factor[0],
        beta:              genotype.deviation_angle[0],
        phi:               genotype.rotation_angle[0],
      };
    }

    var visualize = function(genotype, chambersCount) {
      $scope.genotype = normalizeGenotype(genotype);
      $scope.chambers_count = chambersCount;
      simulation.simulate($scope.genotype, $scope.chambers_count);
    }

    var plotTree = function(forams) {
      root = forams;
      root.x0 = height / 2;
      root.y0 = 0;

      function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      if(root.children) {
        root.children.forEach(collapse);
      }
      update(root);
    };

    d3.select(self.frameElement).style("height", "800px");

    function update(source) {
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      nodes.forEach(function(d) { d.y = d.depth * 180; });

      var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

      var nodeEnter = node.enter().append("g")
                          .attr("class", "node")
                          .attr("transform", function(d) {
                              return "translate(" + source.y0 + "," + source.x0 + ")";
                          })
                          .on("click", click)
                          .on("mouseover", function(d) {
                              visualize(d.genotype, d.chambers_count);
                              tooltipTextBox.html(tooltipText(d));
                              div .style("left", (d3.event.pageX - 110) + "px")
                                  .style("top", (d3.event.pageY - 28) + "px")
                                  .style("opacity", .9);
                          })
                          .on("mouseleave", function(d) {
                            timeoutId = setTimeout(function(){
                                div .style("opacity", 0)
                                    .style("left", (-100) + "px")
                                    .style("top", (-100) + "px");
                            }, 250);
                            $("#tree-tooltip").data('timeoutId', timeoutId);
                          });

      nodeEnter.append("circle")
               .attr("r", 1e-6)
               .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
               .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
               .attr("dy", ".35em")
               .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
               .text(function(d) { return labelText(d); })
               .style("fill-opacity", 1e-6);

      var nodeUpdate = node.transition()
                           .duration(duration)
                           .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
                .style("fill-opacity", 1);

      var nodeExit = node.exit().transition()
                         .duration(duration)
                         .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                         .remove();

      nodeExit.select("circle")
              .attr("r", 1e-6);

      nodeExit.select("text")
              .style("fill-opacity", 1e-6);

      //TODO - change to fenotype
      var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    plotTree(data);
  };

  ForamAPIService.getDescendants(foramId, { level: level }).then(function (response) {
    prepareTree(response.data);
    addTooltipClearing();
  });

}]);
