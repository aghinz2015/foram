'use strict';

app.controller('GalleryCtrl', ['$location', '$scope', '$timeout', 'SettingsService', 'DatasetService', 'SimulationFactory', function ($location, $scope, $timeout, SettingsService, DatasetService, simulationFactory) {

    var swiper;
    var simulation;

    $scope.forams = DatasetService.getProducts();
    $scope.gene = {}

    SettingsService.getSettings().then(
        function (res) {
            $scope.precision = res.data.settings_set.number_precision;
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
            onTransitionStart: loadSimulation,
            onSlideChangeStart: moveAnimation,
            lazyLoading: true,
        });
    });

    var normalizeGenotype = function (genotype) {
        return {
            translationFactor: genotype.translation_factor.effective,
            growthFactor: genotype.growth_factor.effective,
            beta: genotype.deviation_angle.effective,
            phi: genotype.rotation_angle.effective,
        };
    };

    var loadSimulation = function (swiper) {
        $scope.$apply(function () {
            $scope.foram = [$scope.forams[swiper.activeIndex]];
            $scope.genotype = normalizeGenotype($scope.foram[0].genotype);
        });
        $scope.canvas = $('canvas');
        $scope.canvas.detach();
        simulation.simulate($scope.genotype, $scope.foram[0].chambers_count);
    };
    
    var moveAnimation = function (swiper) {
        $scope.canvas.appendTo("#" + swiper.activeIndex);      
    };
    
    var init = function (swiper) {
        $scope.$apply(function () {
            $scope.foram = [$scope.forams[swiper.activeIndex]];
            $scope.genotype = normalizeGenotype($scope.foram[0].genotype);
        });
        console.log($scope.foram[0]);
        simulation.simulate($scope.genotype, $scope.foram[0].chambers_count);  
    };

    $scope.visualize = function () {
        DatasetService.putProducts($scope.foram);
        $location.path("/visualization");
    };
}]);
