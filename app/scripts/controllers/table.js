/**
 * Created by Eryk on 2015-06-09.
 */

app.controller('TableCtrl', ['$location', '$scope', '$http', '$q', 'DatasetService', 'ngDialog', function ($location, $scope, $http, $q, DatasetService, ngDialog) {

  var dialog;

  $scope.forams = [];

  // currentSet represents our currently selected records with start and stop index
  $scope.currentSet = { start: null, stop: null };

  // reference to our options dropdown
  $scope.optionsWindow = $("#options");

  // code should be used when deployed to PROD - gets forams from API
  //$http.get('https://foram-api.herokuapp.com/forams').success(function(data, status, headers, config) {
  //$scope.forams = data.forams;
  //});

  // mock data used to tests
  /*
  $scope.forams = [
    { "id": { "$oid": "55588ef13338610003000000" }, "kx": 0.1, "ky": 0.2, "kz": 0.35, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000001" }, "kx": 0.12, "ky": 0.21, "kz": 0.32, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000002" }, "kx": 0.13, "ky": 0.22, "kz": 0.31, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000003" }, "kx": 0.14, "ky": 0.23, "kz": 0.32, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000004" }, "kx": 0.15, "ky": 0.24, "kz": 0.33, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000005" }, "kx": 0.16, "ky": 0.25, "kz": 0.43, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000006" }, "kx": 0.17, "ky": 0.2, "kz": 0.53, "tf": 0.4, "phi": 0.5, "beta": 0.6 },
    { "id": { "$oid": "55588ef13338610003000007" }, "kx": 0.18, "ky": 0.72, "kz": 0.35, "tf": 0.4, "phi": 0.5, "beta": 0.6 }
  ];*/

  // function which is responsible for selecting events
  $(function () {
    $("#selectable").selectable({
      filter: 'tr',
      start: function (event, ui) {
        $scope.currentSet.start = undefined;
        $scope.currentSet.stop = null;
      },
      selected: function (event, ui) {
        var index = parseInt(ui.selected.getAttribute('data-index'));
        if ($scope.currentSet.start === undefined) {
          $scope.currentSet.start = index;
        }

        if (index > $scope.currentSet.stop || !$scope.currentSet.stop) {
          $scope.currentSet.stop = index;
        }
      },
      stop: function (event, ui) {
        $scope.optionsWindow.css({
          display: 'block',
          left: (event.clientX) + 'px',
          top: (event.clientY) + 'px'
        })
      }
    });
  });

  // test function which change view to charts and sends selected data
  $scope.generateChart = function () {
    DatasetService.putProducts($scope.forams.slice($scope.currentSet.start, $scope.currentSet.stop + 1));
    $location.path("/charts");
  };

  $scope.hasFilters = false;
  $scope.filters = [];
  $scope.filterData = function () {
    var i;
    var flatFilters = {};
    var key;
    for (i in $scope.filters) {
      if ($scope.filters[i].param != undefined) {
        if ($scope.filters[i].min != undefined) {
          key = flatFilterName($scope.filters[i], 'min');
          flatFilters[key] = $scope.filters[i].min
        }
        if ($scope.filters[i].max != undefined) {
          key = flatFilterName($scope.filters[i], 'max');
          flatFilters[key] = $scope.filters[i].max
        }
      }
    }
    console.log(flatFilters);
    getForams(flatFilters);
  };
  $scope.addFilter = function () {
    $scope.filters.push({});
    $scope.hasFilters = true;
  };
  $scope.clearFilters = function () {
    $scope.hasFilters = false;
    $scope.filters = [];
  };
  $scope.deleteFilter = function (index) {
    $scope.filters.splice(index, 1);
    if ($scope.filters.length == 0) $scope.hasFilters = false;
  };
  var flatFilterName = function (filter, suffix) {
    return toUnderScore(filter.param) + "_" + suffix;
  };
  $scope.maxForamsWithoutWarning = 1001; // TODO move to configuration file

  var getForams = function (filters) {
    var numberOfForamsPromise = getNumberOfForamsInDb(filters);
    numberOfForamsPromise.then(function (foramsCount) {
      if (foramsCount > $scope.maxForamsWithoutWarning) {
        dialog = ngDialog.open({ template: 'popupTmpl.html', scope: $scope });
      } else {
        var foramsPromise = getForamsFromDb(filters);
        foramsPromise.then(function (forams) {
          $scope.forams = forams;
        });
      }
    });
  };

  var getNumberOfForamsInDb = function (filters) {
    var deferred = $q.defer();
    console.log(filters);
    $http.head('http://192.168.1.27:3000/forams', {params: filters}).success(function (data, status, headers, config) {
      deferred.resolve(headers().total);
    });
    return deferred.promise;
  };

  var getForamsFromDb = function (filters) {
    var deferred = $q.defer();
    // #TODO include filters
    $http.get('http://192.168.1.27:3000/forams', {params: filters}).success(function (data, status, headers, config) {
      deferred.resolve(data.forams);
    });
    return deferred.promise;
  };

  var toUnderScore = function (str) {
    return str.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
  };

  $scope.skipLoading = function () {
    console.log('closing dialog');
    dialog.close();
  };
  $scope.continueLoading = function () {
    console.log('closing dialog and loading forams without filter');
    dialog.close();
  };
  $scope.createChart = function () {
    dialog.close();
    $location.path('/charts');
  };
  getForams();
}]);
