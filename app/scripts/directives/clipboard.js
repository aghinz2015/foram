'use strict';

app.directive('clipboard', function() {
  return {
    restrict: 'A',

    scope: {
      clipboardCopy: '&',
      clipboardTarget: '&',
      clipboardSuccess: '&',
      clipboardError: '&'
    },

    link: function(scope, element) {
      var id = element.attr('id');

      if (!id) {
        id = 'clipboard' + Date.now();
        element.attr('id', id);
      }

      var clipboard = new Clipboard('#' + id, {
        text: function(trigger) {
          return scope.clipboardCopy(trigger);
        },

        target: function(trigger) {
          return scope.clipboardTarget(trigger);
        }
      });

      clipboard.on('success', function(event) {
        scope.clipboardSuccess(event);
      });

      clipboard.on('error', function(event) {
        scope.clipboardError(event);
      });
    }
  };
})
