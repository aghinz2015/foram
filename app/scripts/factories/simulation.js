'use strict';

app.factory('SimulationFactory', function() {
  return function(canvas) {
    return new Foram3D.Simulation(canvas, { dev: false });
  };
});
