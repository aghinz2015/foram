'use strict';

app.service('SettingsService', ['$http', 'api_host', '$q', function($http, api_host, $q) {
  var settings;

  this.saveSettings = function(newSettings) {
    settings = {settings_set: newSettings};
  };

  this.getSettings = function() {
    if(!settings){
      return $http.get(api_host+'/user/settings_set');
    } else {
      return $q(function (resolve, reject) {
        setTimeout(function () {
          resolve({data: settings});
        }, 100);
      });
    }
  };

}]);
