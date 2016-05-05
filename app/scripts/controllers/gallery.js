'use strict';

app.controller('GalleryCtrl', ['$location', '$scope', '$timeout', '$modal', 'SettingsService', 'DatasetService', 'SimulationFactory', 'ForamAPIService', 'UserService',
    function ($location, $scope, $timeout, $modal, SettingsService, DatasetService, simulationFactory, ForamAPIService, UserService) {

    var swiper;
    var simulation;
    var treeModalInstance;
    $scope.treeLevel;

    $scope.forams = DatasetService.getProducts('foram-storage');
    $scope.gene = {};

    SettingsService.getSettings().then(
        function (res) {
            $scope.precision = res.data.settings_set.number_precision;
            $scope.treeLevel = res.data.settings_set.tree_level;
        },
        function (err) {
            console.error(err);
        }
        );

    $timeout(function () {
        simulation = simulationFactory(document.getElementById('0'));
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            spaceBetween: 30,
            onInit: init,
            onTransitionStart: changeCurrentForam,
            onSlideChangeStart: moveAnimation,
            lazyLoading: true
        });
    });

    var normalizeGenotype = function (genotype) {
        return {
            translationFactor: genotype.translation_factor.effective,
            growthFactor: genotype.growth_factor.effective,
            beta: genotype.deviation_angle.effective,
            phi: genotype.rotation_angle.effective
        };
    };

    var changeCurrentForam = function (swiper) {
        $scope.$apply(function () {
            $scope.foram = [$scope.forams[swiper.activeIndex]];
            $scope.genotype = normalizeGenotype($scope.foram[0].genotype);
            $scope.foramId = $scope.foram[0].foram_id;
        });

        changeChildrenCount();
        changeSimulation();
    };

    var changeSimulation = function() {
        $scope.canvas = $('canvas');
        $scope.canvas.detach();
        simulation.simulate($scope.genotype, $scope.foram[0].chambers_count);
    };

    var changeChildrenCount = function() {
        $scope.childrenCount = "";
        ForamAPIService.getChildrenCount($scope.foramId).then(function (response) {
            if (response.status < 400) {
                console.log(response.data)
                $scope.childrenCount = response.data.children_count;
            }
        });
    };

    var moveAnimation = function (swiper) {
        $scope.canvas.appendTo("#" + swiper.activeIndex);
    };

    var init = function (swiper) {
        $scope.$apply(function () {
            $scope.foram = [$scope.forams[swiper.activeIndex]];
            $scope.genotype = normalizeGenotype($scope.foram[0].genotype);
            $scope.foramId = $scope.foram[0].foram_id;
        });
        changeChildrenCount();
        simulation.simulate($scope.genotype, $scope.foram[0].chambers_count);
    };

    $scope.descendantsTree = function () {
      treeModalInstance = $modal.open({
        templateUrl: 'views/tree_creator.html',
        scope: $scope,
        windowClass: 'small'
      });
    };

    $scope.generateTree = function (level) {
      treeModalInstance.close();
      $location.search('level', level);
      $location.search('foramId', $scope.foram[0]['_id']['$oid']);
      UserService.updateUserSettings({ tree_level: level });
      $location.path("/tree");
    };

    $scope.visualize = function () {
        DatasetService.putProducts($scope.foram,'foram-storage');
        $location.path("/visualization");
    };
}]);
