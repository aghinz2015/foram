/**
 * Created by Eryk on 2015-05-26.
 */

'use strict';

app.directive('foramTable',function(){
  return {
    restrict: 'E',
    scope: {
      foram: "=foram"
    },
    templateUrl: '/views/foram-table.html'
  }
});
