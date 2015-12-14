'use strict';

app.controller('GalleryCtrl', ['$scope', '$timeout', 'DatasetService', 'SimulationFactory', function ($scope, $timeout, DatasetService, simulationFactory) {

    var swiper;
    var loadedElements;
    
    $scope.forams = DatasetService.getProducts();
    
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
        console.log($scope.forams.length);
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
        if(loadedElements[swiper.activeIndex]) return;
        var element = document.getElementById(swiper.activeIndex);
        element.innerHTML = "";
        var simulation = simulationFactory(element);
        $scope.genotype = normalizeGenotype($scope.forams[swiper.activeIndex].genotype);
        simulation.simulate($scope.genotype, 7);
        loadedElements[swiper.activeIndex] = true;
    };
    
}]);
