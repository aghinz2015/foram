/**
 * Created by Eryk on 2015-05-26.
 */

'use strict';

// foramTable directive used to present forams in table view
// #TODO is directive the best solution?
app.directive('foramTable',function(){
  return {
    restrict: 'E',
    scope: {
      foram: "=foram"
    },
    templateUrl: '/views/foram-table.html'
  }
});
