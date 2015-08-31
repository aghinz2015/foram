/**
 * Created by Eryk on 2015-06-09.
 */

app.controller('TableCtrl', ['$location', '$scope', '$http', '$q', 'DatasetService', 'ngDialog','ConfigService', function ($location, $scope, $http, $q, DatasetService, ngDialog,ConfigService) {

  var dialog;

  // #TODO Improvment on API side or move to configuration file
  $scope.availableFilterParams = ConfigService.getFilterConfig();
  $scope.unavaiableParams = [];
  $scope.foramsLoaded = false;
  $scope.forams = [];
  $scope.numberOfForams = 1;
  $scope.foramsPerPage = 1;
  $scope.currentPage = 1;

  //currentSet represents our currently selected records with start and stop index
  var currentSet = { start: null, stop: null };

  // reference to our options dropdown
  $scope.optionsWindow = $("#options");

  // function which is responsible for selecting events
  $(function () {
    $("#selectable").selectable({
      filter: 'tr',
      start: function (event, ui) {
        currentSet.start = undefined;
        currentSet.stop = null;
      },
      selected: function (event, ui) {
        var index = parseInt(ui.selected.getAttribute('data-index'));
        if (currentSet.start === undefined) {
          currentSet.start = index;
        }

        if (index > $scope.currentSet.stop || !currentSet.stop) {
          currentSet.stop = index;
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
    DatasetService.putProducts($scope.forams.slice($scope.currentSet.start, currentSet.stop + 1));
    $location.path("/charts");
  };

  $scope.hasFilters = false;
  $scope.filters = [];
  var flatFilters = {};

  $scope.isParamUnavailable = function (paramName) {
    return ($scope.unavaiableParams.indexOf(paramName) > -1);
  };

  $scope.filterData = function () {
    flatFilters = {};
    var i;
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
    getForams(flatFilters);
  };

  $scope.addFilter = function () {
    $scope.filters.push({});
    $scope.hasFilters = true;
  };
  $scope.clearFilters = function () {
    $scope.hasFilters = false;
    $scope.filters = [];
    flatFilters = {};
    getForams();
  };
  $scope.deleteFilter = function (index) {
    var filter = $scope.filters[index];
    var key;
    if (filter.max != undefined) {
      key = flatFilterName(filter, 'max');
      flatFilters[key] = undefined;
    }
    if (filter.min != undefined) {
      key = flatFilterName(filter, 'min');
      flatFilters[key] = undefined;
    }
    $scope.filters.splice(index, 1);
    if ($scope.filters.length == 0) $scope.hasFilters = false;
    getForams();
  };
  var flatFilterName = function (filter, suffix) {
    return toUnderScore(filter.param) + "_" + suffix;
  };
  $scope.maxForamsWithoutWarning = 100; // TODO move to configuration file

  var getForams = function () {
    var foramsInfoPromise = getForamsInfo();
    foramsInfoPromise.then(function (foramsInfo) {
      $scope.numberOfForams = foramsInfo.total;
      $scope.foramsPerPage = foramsInfo["per-page"];
      if ($scope.numberOfForams > $scope.maxForamsWithoutWarning) {
        dialog = ngDialog.open({ template: 'popupTmpl.html', scope: $scope });
      } else {
        setForams();
        $scope.foramsLoaded = true;
      }
    });
  };

  var getForamsInfo = function () {
    var deferred = $q.defer();
    $http.head('localhost:3000/forams', { params: flatFilters }).success(function (data, status, headers, config) {
      deferred.resolve(headers());
    });
    return deferred.promise;
  };

  var getForamsFromDb = function () {
    var deferred = $q.defer();
    $http.get('localhost:3000/forams', { params: flatFilters }).success(function (data, status, headers, config) {
      deferred.resolve(data.forams);
    });
    return deferred.promise;
  };

  var setForams = function (openDialog) {
    var foramsPromise = getForamsFromDb();
    foramsPromise.then(function (forams) {
      $scope.forams = forams;
      if (openDialog) {
        dialog.close();
      }
    });
  };

  var toUnderScore = function (str) {
    return str.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
  };

  $scope.prevPage = function () {
    if ($scope.currentPage > 1) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function () {
    return $scope.currentPage === 1 ? "disabled" : "";
  };

  $scope.nextPage = function () {
    if ($scope.currentPage < $scope.pageCount() - 1) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function () {
    return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
  };

  $scope.pageCount = function () {
    return Math.ceil($scope.numberOfForams / $scope.foramsPerPage);
  };

  $scope.setPage = function (n) {
    if (n > 0 && n < $scope.pageCount()) {
      $scope.currentPage = n;
    }
  };

  $scope.$watch("currentPage", function () {
    flatFilters['page'] = $scope.currentPage;
    if ($scope.foramsLoaded) {
      setForams();
    }
  });

  $scope.$watch("filters", function (newFilters, oldFilters) {
    oldFilters.forEach(function (element) {
      if ($scope.isParamUnavailable(element.param)) {
        var index = $scope.unavaiableParams.indexOf(element.param);
        $scope.unavaiableParams.splice(index, 1);
      }
    });
    newFilters.forEach(function (element) {
      $scope.unavaiableParams.push(element.param);
    });
  }, true);

  $scope.range = function () {
    var rangeSize = 5;
    var ret = [];
    var start;

    start = $scope.currentPage;
    if (start > $scope.pageCount() - rangeSize) {
      start = $scope.pageCount() - rangeSize;
    }

    for (var i = start; i < start + rangeSize; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.skipLoading = function () {
    dialog.close();
    $scope.foramsLoaded = false;
  };
  $scope.continueLoading = function () {
    setForams(true);
    $scope.foramsLoaded = true;
  };
  $scope.createChart = function () {
    dialog.close();
    $location.path('/charts');
  };
  getForams();
}]);
