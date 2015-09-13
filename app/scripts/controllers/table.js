app.controller('TableCtrl', ['$location', '$scope', 'ForamAPIService', 'ConfigService','$q', '$http', function ($location, $scope, ForamAPIService, ConfigService, $q, $http) {

  var maxForams;
  var foramsPerPage = 1;

  ConfigService.getFilterConfig().then(
    function(response){
      var data = response.data;
      $scope.availableFilterParams = data.availableFilterParams;
      maxForams = data.maxForams;
    },function(response){
      console.log('GetFilterConfig::Error - ',response.status);
    });

  $scope.unavaiableParams = [];
  $scope.foramsLoaded = false;
  $scope.forams = [];
  $scope.numberOfForams = 1;
  $scope.currentPage = 1;
  $scope.newFilter = {};

  ////////////////////////    SELECTABLES    ///////////////////////////

  //currentSet represents our currently selected records with start and stop index
  var currentSet = { start: null, stop: null };

  // reference to our options dropdown
  var optionsWindow = $("#options");

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

        if (index > currentSet.stop || !currentSet.stop) {
          currentSet.stop = index;
        }
      },
      stop: function (event, ui) {
        optionsWindow.css({
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

  ////////////////////////    SELECTABLES    ///////////////////////////


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
    filterForams(flatFilters);
  };

  $scope.addFilter = function () {
    $scope.filters.push($scope.newFilter);
    $scope.newFilter = {};
  };
  $scope.clearFilters = function () {
    $scope.filters = [];
    flatFilters = {};
    filterForams();
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
    filterForams();
  };


  var flatFilterName = function (filter, suffix) {
    return toUnderScore(filter.param) + "_" + suffix;
  };


  var filterForams = function () {
    ForamAPIService.getForamsInfo()
      .then(function (response) {
        var headers = response.headers();
        $scope.numberOfForams = headers.total;
        foramsPerPage = headers["per-page"];
        if ($scope.numberOfForams > maxForams) {
          $scope.foramTableVisible = false;
        } else {
          loadForams();
          $scope.foramsLoaded = true;
        }
    },function(error){
        console.log("getForamsInfo::")
      });
  };

  var loadForams = function () {
    ForamAPIService.getForams(flatFilters)
      .then(function(response){
        $scope.forams = response.data.forams;
      },function(error){
        console.log("loadForams::Error - ", error);
      });
  };

  var toUnderScore = function (str) {
    return str.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
  };


  $scope.pagination = {
    prevPage: function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
      }
    },

    prevPageDisabled: function () {
      return $scope.currentPage === 1 ? "disabled" : "";
    },

    nextPage: function () {
      if ($scope.currentPage < this.pageCount() - 1) {
        $scope.currentPage++;
      }
    },

    nextPageDisabled: function () {
      return $scope.currentPage === this.pageCount() - 1 ? "disabled" : "";
    },

    pageCount: function () {
      return Math.ceil($scope.numberOfForams / foramsPerPage);
    },

    setPage: function (n) {
      if (n > 0 && n < this.pageCount()) {
        $scope.currentPage = n;
      }
    }
  };

  $scope.$watch("currentPage", function () {
    flatFilters['page'] = $scope.currentPage;
    if ($scope.foramsLoaded) {
      loadForams();
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
    if (start > $scope.pagination.pageCount() - rangeSize) {
      start = $scope.pagination.pageCount() - rangeSize;
    }

    for (var i = start; i < start + rangeSize; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.skipLoading = function () {
    $scope.foramsLoaded = false;
    $scope.foramTableVisible = false;
  };

  $scope.continueLoading = function () {
    loadForams();
    $scope.foramsLoaded = true;
    $scope.foramTableVisible = true;
  };

  filterForams();
}]);

