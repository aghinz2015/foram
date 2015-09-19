app.controller('TableCtrl', ['$location', '$scope', 'ForamAPIService', 'ConfigService', function ($location, $scope, ForamAPIService, ConfigService) {


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
    // #TODO dataset service was removed - create http request for same foram data
    //DatasetService.putProducts($scope.forams.slice($scope.currentSet.start, currentSet.stop + 1));
    $location.search(prepareFilters());
    $location.path("/charts");
  };

  ////////////////////////    FILTERS    ///////////////////////////

  // variables
  $scope.filters = [];
  $scope.newFilter = {};
  $scope.constantFilters = {};

  var flatFilters = {};

  // prepare flat filters
  var prepareFilters = function(){
    var filters = {};
    var i;
    var key;
    for (i in $scope.filters) {
      if ($scope.filters[i].param != undefined) {
        if ($scope.filters[i].min != undefined) {
          key = $scope.filters[i].param+'_min';
          filters[key] = $scope.filters[i].min;
        }
        if ($scope.filters[i].max != undefined) {
          key = $scope.filters[i].param+'_max';
          filters[key] = $scope.filters[i].max;
        }
      }
    }

    if(($scope.constantFilters.is_diploid && $scope.constantFilters.is_haploid) || (!$scope.constantFilters.is_diploid && !$scope.constantFilters.is_haploid)){
      filters.is_diploid = undefined;
    } else {
      filters.is_diploid = $scope.constantFilters.is_diploid;
    }

    filters.death_step_no_min = $scope.constantFilters.death_step_no_min;
    filters.death_step_no_max = $scope.constantFilters.death_step_no_max;

    return filters;
  };

  // fliter data with current filters
  $scope.filterData = function () {
    flatFilters = prepareFilters();
    filterForams();
  };

  // add new filter
  $scope.addFilter = function () {
    if(!checkIntersectingFilters() && $scope.newFilter.param){
      $scope.filters.push($scope.newFilter);
      $scope.newFilter = {};
    }
  };

  // clear all filters
  $scope.clearFilters = function () {
    $scope.filters = [];
    flatFilters = {};
    $scope.constantFilters = {
      diploid: true,
      haploid: true
    };
    filterForams();
  };

  // delete filter and load forams
  $scope.deleteFilter = function (index) {
    var filter = $scope.filters[index];
    var key;
    if (filter.max != undefined) {
      key = filter.param+'_max';
      flatFilters[key] = undefined;
    }
    if (filter.min != undefined) {
      key = filter.param+'_min';
      flatFilters[key] = undefined;
    }
    $scope.filters.splice(index, 1);
    filterForams();
  };

  // check filters for intersecting
  var checkIntersectingFilters = function(){
    var result = false;

    for (i in $scope.filters) {
      if($scope.filters[i].param == $scope.newFilter.param){
        $scope.filters[i] = $scope.newFilter;
        result = true;
        break;
      }
    }
    return result;
  };

  // filter forams - get total number and then load forams
  var filterForams = function () {
    ForamAPIService.getForamsInfo(flatFilters)
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
        console.log("getForamsInfo::Error - ", error)
      });
  };

  // load forams with current filters
  var loadForams = function () {
    ForamAPIService.getForams(flatFilters)
      .then(function(response){
        $scope.forams = response.data.forams;
      },function(error){
        console.log("loadForams::Error - ", error);
      });
  };

  ////////////////////////    PAGINATION    ///////////////////////////

  $scope.currentPage = 1;

  // all pagination functions
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
    },

    range : function () {
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
    }
  };

  // watching current page number and loading forams
  $scope.$watch("currentPage", function () {
    flatFilters['page'] = $scope.currentPage;
    if ($scope.foramsLoaded) {
      loadForams();
    }
  });

  ////////////////////////    LOADING    ///////////////////////////

  var maxForams;
  var foramsPerPage = 1;

  $scope.foramsLoaded = false;
  $scope.forams = [];
  $scope.numberOfForams = 1;

  ConfigService.getFilterConfig().then(
    function(response){
      var data = response.data;
      $scope.availableFilterParams = data.availableFilterParams;
      maxForams = data.maxForams;
    },function(response){
      console.log('GetFilterConfig::Error - ',response.status);
    });

  $scope.skipLoading = function () {
    $scope.foramsLoaded = false;
    $scope.foramTableVisible = false;
  };

  $scope.continueLoading = function () {
    loadForams();
    $scope.foramsLoaded = true;
    $scope.foramTableVisible = true;
  };

  ////////////////////////    INIT     ///////////////////////////

  filterForams();

}]);

