app.controller('TableCtrl', ['$location', '$scope', '$modal', 'ForamAPIService', 'ConfigService', 'DatasetService', 'SettingsService', 'ToastService', 'UserService', 'FileSaver',
  function ($location, $scope, $modal, ForamAPIService, ConfigService, DatasetService, SettingsService, ToastService, UserService, FileSaver) {

    ////////////////////////    SELECTABLES    ///////////////////////////
    var currentSet = [];
    var treeModalInstance;
    $scope.treeLevel;

    // function which is responsible for selecting events
    $(function () {
      $("#selectable").selectable({
        filter: 'tr',
        stop: function () {
          currentSet = [];
          $(".ui-selected", this).each(function () {
            currentSet.push(parseInt($(this).attr('data-index')));
          });
        }
      });
    });

    $scope.selectedForams = function () {
      var foramsSelected = [];
      currentSet.forEach(function (element, index) {
        foramsSelected.push($scope.forams[element]);
      });
      return foramsSelected;
    };

    $scope.generateChart = function () {
      $location.path("/charts");
    };

    $scope.visualize = function () {
      DatasetService.putProducts($scope.selectedForams(),'foram-storage');
      $location.path("/visualization");
    };

    $scope.death3DMap = function () {
      $location.path("/3d-map");
    };

    $scope.deathBubbleMap = function () {
      $location.path("/bubble-map/bubble");
    };

    $scope.tree = function () {
      treeModalInstance = $modal.open({
        templateUrl: 'views/tree_creator.html',
        scope: $scope,
        windowClass: 'small'
      });
    };

    $scope.generateTree = function (level) {
      treeModalInstance.close();
      $location.search('level', level);
      $location.search('foramId', $scope.selectedForams()[0]['_id']['$oid']);
      UserService.updateUserSettings({ tree_level: level });
      $location.path("/tree");
    };


    $scope.download = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/foram_downloader.html',
        controller: 'ForamDownloaderCtrl',
        windowClass: 'small'
      });

      modalInstance.result.then(function (newDownload) {
        flatFilters = prepareFilters();
        $scope.loader = true;
        ForamAPIService.getForams(flatFilters, newDownload.format)
          .then(
            function (res) {
              $scope.loader = false;
              if (res.data) {
                if (res.status < 400) {
                  var format = newDownload.format === '.csv' ? 'text/csv' : 'text/plain';
                  var blob = new Blob([res.data], { type: format });

                  FileSaver.saveAs(blob, newDownload.fileName + newDownload.format);
                } else {
                  ToastService.showServerToast(res.data, 'error', 3000);
                }
              }
            },
            function (err) {
              $scope.loader = false;
              ToastService.showToast('Cannot connect to server', 'error', 3000);
            });
      });
    };

    $scope.showForamGallery = function () {
      $scope.selectedForams().length > 0 ? DatasetService.putProducts($scope.selectedForams(),'foram-storage') : DatasetService.putProducts($scope.forams,'foram-storage');
      $location.path('/gallery');
    };

    ////////////////////////    FILTERS    ///////////////////////////

    // variables
    $scope.filters = [];
    $scope.newFilter = {};
    $scope.constantFilters = {};
    $scope.editName = false;
    var flatFilters = {},
      directions = ['asc', 'desc'];

    $scope.loadedFilterSet = { name: "Set filter set name" };


    // select simulation
    ForamAPIService.getSimulations().then(
      function (res) {
        if (res.data) {
          if (res.status < 400) {
            $scope.availableSimulations = res.data.simulation_starts;
          } else {
            ToastService.showServerToast(res.data, 'error', 3000);
          }
        }
      }, function (err) {
        ToastService.showToast('Cannot connect to server', 'error', 3000);
      }
      );

    $scope.simulationStart = ForamAPIService.getCurrentSimulation();

    $scope.$watch('simulationStart', function (newValue, oldValue) {
      if (newValue) {
        ForamAPIService.setSimulation(newValue);
        filterForams();
      }
    });

    // prepare flat filters
    var prepareFilters = function () {
      var filters = {};
      var i;
      var key;
      for (i in $scope.filters) {
        if ($scope.filters[i].param != undefined) {
          if ($scope.filters[i].min != undefined) {
            key = $scope.filters[i].param + "_min";
            key = key.replace(/\s+/g, '');
            filters[key] = $scope.filters[i].min;
          }
          if ($scope.filters[i].max != undefined) {
            key = $scope.filters[i].param + "_max";
            key = key.replace(/\s+/g, '');
            filters[key] = $scope.filters[i].max;
          }
        }
      }

      if (($scope.constantFilters.is_diploid && $scope.constantFilters.is_haploid) || (!$scope.constantFilters.is_diploid && !$scope.constantFilters.is_haploid)) {
        filters.is_diploid = undefined;
      } else {
        filters.is_diploid = !$scope.constantFilters.is_haploid;
      }

      if ($scope.constantFilters.order_by && $scope.constantFilters.direction) {
        filters.order_by = $scope.constantFilters.order_by;
        filters.direction = directions[$scope.constantFilters.direction - 1];
      }



      return filters;
    };

    // fliter data with current filters
    $scope.filterData = function () {
      flatFilters = prepareFilters();
      DatasetService.putProducts(flatFilters,'foram-filters');
      filterForams();
    };

    $scope.switchSort = function (attribute, $event) {
      if (typeof $scope.forams[0][attribute] == 'number' || ($scope.forams[0].genotype[attribute] && typeof $scope.forams[0].genotype[attribute].effective == 'number')) {
        if ($scope.constantFilters.order_by === attribute) {
          $scope.constantFilters.direction = ($scope.constantFilters.direction + 1) % 3
        } else {
          var previous = document.getElementsByClassName(directions[$scope.constantFilters.direction - 1]);
          if (previous[0])
            previous[0].className = '';

          $scope.constantFilters.order_by = attribute;
          $scope.constantFilters.direction = 1;
        }

        $event.currentTarget.className = directions[$scope.constantFilters.direction - 1];
        $scope.filterData();
      }

    };

    // add new filter
    $scope.addFilter = function () {
      if (!checkIntersectingFilters() && $scope.newFilter.param) {
        $scope.filters.push($scope.newFilter);
        $scope.newFilter = {};
      }
    };

    // clear all filters
    $scope.clearFilters = function () {
      $scope.filters = [];
      flatFilters = {};
      $scope.loadedFilterSet = { name: "Set filters set name" };
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
        key = filter.param + '_max';
        flatFilters[key] = undefined;
      }
      if (filter.min != undefined) {
        key = filter.param + '_min';
        flatFilters[key] = undefined;
      }
      $scope.filters.splice(index, 1);
      filterForams();
    };

    // check filters for intersecting
    var checkIntersectingFilters = function () {
      var result = false;

      for (var i in $scope.filters) {
        if ($scope.filters[i].param == $scope.newFilter.param) {
          $scope.filters[i] = $scope.newFilter;
          result = true;
          break;
        }
      }
      return result;
    };

    // filter forams - get total number and then load forams
    var filterForams = function () {
      $scope.loader = true;
      ForamAPIService.getForams(flatFilters)
        .then(function (res) {
          if (res.status < 400) {
            var headers = res.headers();
            $scope.numberOfForams = headers.total;
            foramsPerPage = headers["per-page"];
            $scope.forams = res.data.forams;
          } else {
            ToastService.showServerToast(res.data, 'error', 5000);
          }
          $scope.loader = false;
        }, function (err) {
          ToastService.showToast('Cannot connect to server', 'error', 5000);
          $scope.loader = false;
        });
    };

    $scope.open = function () {
      var filters = prepareFilters();
      var modalInstance = $modal.open({
        templateUrl: 'views/filter-creator.html',
        controller: 'FilterCreatorCtrl',
        windowClass: 'small',
        resolve: {
          availableFilterParams: function () {
            return $scope.availableFilterParams;
          },
          precision: function () {
            return $scope.precision;
          },
          filters: function () {
            return filters;
          }
        }
      });

      modalInstance.result.then(function (newFilter) {
        $scope.newFilter = newFilter;
        $scope.addFilter();
      });
    };

    var unflattenFilter = function (filter) {
      if (filter['is_diploid'] != null) {
        $scope.constantFilters['is_diploid'] = filter['is_diploid'];
        $scope.constantFilters['is_haploid'] = !filter['is_diploid'];
      }

      $scope.availableFilterParamsToLoad.forEach(function (element) {
        var unflattedFilter = { param: element };
        if (filter[element + '_min'] != null) unflattedFilter['min'] = filter[element + '_min'];
        if (filter[element + '_max'] != null) unflattedFilter['max'] = filter[element + '_max'];
        if (unflattedFilter.min != undefined || unflattedFilter.max != undefined) $scope.filters.push(unflattedFilter);
      });
    };

    $scope.editFilter = function (index) {
      var modalInstance = $modal.open({
        templateUrl: 'views/filter_editor.html',
        controller: 'FilterEditorCtrl',
        windowClass: 'small',
        resolve: {
          filter: function () {
            return $scope.filters[index];
          },
          availableFilterParams: function () {
            return $scope.availableFilterParams;
          }
        }
      });
      modalInstance.result.then(function (filter) {
        $scope.filters[index] = filter;
      })
    };

    $scope.saveFiltersSet = function () {
      var filtersToSave = {};
      filtersToSave = prepareFilters();
      filtersToSave.name = $scope.loadedFilterSet.name;

      var modalInstance = $modal.open({
        templateUrl: 'views/filter_saver.html',
        controller: 'FilterSaverCtrl',
        windowClass: 'small',
        resolve: {
          filtersToSave: function () {
            return filtersToSave;
          }
        }
      });

      modalInstance.result.then(function (loadedFilter) {
        $scope.loadedFilterSet = { _id: loadedFilter._id, name: loadedFilter.name };
      });

    };

    $scope.loadFilters = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/filter_loader.html',
        controller: 'FilterLoaderCtrl',
        windowClass: 'small'
      });

      modalInstance.result.then(function (loadedFilter) {
        $scope.filters = [];
        flatFilters = {};
        $scope.constantFilters = {};
        $scope.loadedFilterSet = { _id: loadedFilter._id, name: loadedFilter.name };
        unflattenFilter(loadedFilter);
      });
    };

    $scope.updateFiltersSet = function () {
      flatFilters = prepareFilters();
      flatFilters.name = $scope.loadedFilterSet.name;
      var id = $scope.loadedFilterSet._id.$oid;

      ForamAPIService.updateFilters(id, flatFilters).then(function (response) {
        if (response.status < 400) {
          ToastService.showToast('Filters set updated successfully', 'success', 3000);
        } else {
          ToastService.showServerToast(response.data, 'error', 3000);
        }
      }, function (error) {
        ToastService.showToast('Cannot connect to server', 'error', 3000);
      });
    };

    $scope.deleteFiltersSet = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/filter_deleter.html',
        controller: 'FilterDeleterCtrl',
        windowClass: 'small',
        resolve: {
          filter: function () {
            return $scope.loadedFilterSet;
          }
        }
      });

      modalInstance.result.then(function (deleted) {
        if (deleted) {
          $scope.clearFilters();
          ToastService.showToast('Filters set deleted successfully', 'success', 3000);
        } else {
          ToastService.showToast('Error occured while deleting set', 'error', 3000);
        }
      });
    };

    ////////////////////////    PAGINATION    ///////////////////////////

    $scope.currentPage = 1;

    var foramsPerPage;

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
        if ($scope.currentPage < this.pageCount()) {
          $scope.currentPage++;
        }
      },

      lastPage: function () {
        var lastPage = $scope.pagination.pageCount();
        $scope.currentPage = lastPage;
      },

      firstPage: function () {
        $scope.currentPage = 1;
      },

      nextPageDisabled: function () {
        return $scope.currentPage === this.pageCount() ? "disabled" : "";
      },

      pageCount: function () {
        var pages = parseInt($scope.numberOfForams / foramsPerPage);
        var lastPage = (pages * foramsPerPage < $scope.numberOfForams) ? pages + 1 : pages;
        return lastPage;
      },

      setPage: function (n) {
        if (n > 0 && n < this.pageCount()) {
          $scope.currentPage = n;
        }
      },

      range: function () {
        var rangeSize = 5,
            ret = [],
            start,
            tempStart;

        start = $scope.currentPage;
        if (start > $scope.pagination.pageCount() - rangeSize) {
          start = $scope.pagination.pageCount() + 1 - rangeSize;
        }

        if(start < 1) {
          tempStart = 1;
        } else {
          tempStart = start;
        }

        for (var i = tempStart; i < start + rangeSize; i++) {
          ret.push(i);
        }

        return ret;
      }
    };



    ////////////////////////    LOADING    ///////////////////////////

    $scope.forams = [];
    $scope.numberOfForams = 1;

    ForamAPIService.getForamsAttributes().then(
      function (res) {
        if (res.data) {
          if (res.status < 400) {
            var data = res.data;
            $scope.displayAttributes = data.forams;
          } else {
            ToastService.showServerToast(res.data, 'error', 3000);
          }
        }
      }, function (err) {
        ToastService.showToast('Cannot connect to server', 'error', 3000);
      }
      );

    ForamAPIService.getFiltersAttributes().then(
      function (res) {
        if (res.data) {
          if (res.status < 400) {
            var data = res.data;
            $scope.availableFilterParamsToLoad = data.attributes;
            data.attributes.splice(data.attributes.indexOf('is_diploid'), 1);
            $scope.availableFilterParams = data.attributes;
            if(firstLoad){
              firstLoad = false;
              flatFilters = DatasetService.getProducts('foram-filters');
              unflattenFilter(flatFilters);
              filterForams();
            }
          } else {
            ToastService.showServerToast(res.data, 'error', 3000);
          }
        }
      }, function (err) {
        ToastService.showToast('Cannot connect to server', 'error', 3000);
      }
    );

    //////////////////////// DISPLAY SETTINGS //////////////////////

    $scope.precision = 16;
    $scope.mappings = {};
    $scope.loader = false;
    $scope.visibility = {};
    var firstLoad = true;

    SettingsService.getSettings().then(
      function (res) {
        $scope.precision = res.data.settings_set.number_precision;
        $scope.treeLevel = res.data.settings_set.tree_level;
        if (!angular.equals({}, res.data.settings_set.mappings)) {
          $scope.mappings = res.data.settings_set.mappings;
        }
      },
      function (err) {
        console.error(err);
      }
      );

    //////////////// INIT /////////////////////

    // watching current page number and loading forams
    $scope.$watch("currentPage", function () {
      if(!firstLoad) {
        flatFilters['page'] = $scope.currentPage;
        filterForams();
      }
    });


  }]);
