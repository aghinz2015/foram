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
            onInit: loadSimulation,
            onSlideChangeEnd: loadSimulation,
            lazyLoading: true
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
        simulation.simulate($scope.genotype, 7);
        var canvas = $('canvas');
        canvas.detach();
        canvas.appendTo("#" + swiper.activeIndex);
    };

    $scope.visualize = function () {
        DatasetService.putProducts($scope.foram);
        $location.path("/visualization");
    };
}]);
