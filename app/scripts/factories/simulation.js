'use strict';

app.factory('SimulationFactory', function() {
  return function(canvas) {
    return new Simulation(canvas);
  };
});
