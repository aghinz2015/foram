'use strict';

app.controller('GalleryCtrl', ['$location', '$scope', '$timeout', 'SettingsService', 'DatasetService', 'SimulationFactory', function ($location, $scope, $timeout, SettingsService, DatasetService, simulationFactory) {

    var swiper;
    var loadedElements;

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
        loadedElements = Array.apply(null, Array($scope.forams.length)).map(function () { return false });
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
        
        if (loadedElements[swiper.activeIndex]) return;
        var element = document.getElementById(swiper.activeIndex);
        element.innerHTML = "";
        var simulation = simulationFactory(element);
        simulation.simulate($scope.genotype, 7);
        loadedElements[swiper.activeIndex] = true;
    };
    
    $scope.visualize = function () {
      DatasetService.putProducts($scope.foram);
      $location.path("/visualization");
    };

}]);
