app.controller('TableCtrl', ['$location', '$scope', '$modal', 'ForamAPIService', 'ConfigService', 'DatasetService', function ($location, $scope, $modal, ForamAPIService, ConfigService, DatasetService) {

  ////////////////////////    SELECTABLES    ///////////////////////////

  //currentSet represents our currently  records with start and stop index
  var currentSet = { start: null, stop: null };

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
      }
    });
  });

  $scope.selectedForams = function() {
    return $scope.forams.slice(currentSet.start, currentSet.stop + 1);
  }

  $scope.generateChart = function () {
    $location.search(prepareFilters());
    $location.path("/charts");
  };

  $scope.visualize = function() {
    DatasetService.putProducts($scope.selectedForams());
    $location.path("/visualization");
  }

  $scope.downloadCSV = function() {
    flatFilters = prepareFilters();
    ForamAPIService.getForams(flatFilters, '.csv').then(function (response) {
      var anchor = angular.element('<a/>');
      anchor.attr({
        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
        target: '_blank',
        download: 'forams.csv'
      })[0].click();
    },function(error){
      console.log("getForamsInfo::Error - ", error)
    });
  }

  $scope.downloadGEN = function() {
    flatFilters = prepareFilters();
    ForamAPIService.getForams(flatFilters, '.gen').then(function (response) {
      var anchor = angular.element('<a/>');
      anchor.attr({
        href: 'data:attachment/gen;charset=utf-8,' + encodeURI(response.data),
        target: '_blank',
        download: 'forams.gen'
      })[0].click();
    },function(error){
      console.log("getForamsInfo::Error - ", error)
    });
  }

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
          key = $scope.filters[i].param+"_min";
          key = key.replace(/\s+/g, '');
          filters[key] = $scope.filters[i].min;
        }
        if ($scope.filters[i].max != undefined) {
          key = $scope.filters[i].param+"_max";
          key = key.replace(/\s+/g, '');
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

    for (var i in $scope.filters) {
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

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/filter_creator.html',
      controller:  'FilterCreatorCtrl',
      windowClass: 'small',
      resolve: {
        availableFilterParams: function () {
          return $scope.availableFilterParams;
        }
      }
    });

    modalInstance.result.then(function(newFilter) {
      $scope.newFilter = newFilter;
      $scope.addFilter();
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
      $scope.availableFilterParams = data.availableFilterParams.map(function(s){return s.replace(/\s+/g, '')});
      maxForams = data.maxForams;
    },function(response){
      console.log('GetFilterConfig::Error - ',response.status);
    });

  loadForams();
  $scope.foramsLoaded = true;
  $scope.foramTableVisible = true;

  ////////////////////////    INIT     ///////////////////////////

  filterForams();

}]);
