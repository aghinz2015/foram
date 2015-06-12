/**
 * Created by Eryk on 2015-06-10.
 */

app.service('datasetService', function() {
  var productList = [];

  var addProduct = function(newDataset) {
    productList = newDataset;
  };

  var getProducts = function(){
    return productList;
  };

  return {
    addProduct: addProduct,
    getProducts: getProducts
  };

});
