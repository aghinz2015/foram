'use strict';

app.service('SettingsService', ['$http', 'api_host', function($http, api_host) {
  var settings;

  this.saveSettings = function(newSettings) {
    settings = newSettings;
  };

  this.getSettings = function() {
    if(!settings){
      $http.get(api_host+'/user/settings_set').then(
        function(res){
          settings = res.data.settings_set;
        },
        function(err){
          console.error(err);
        }
      )
    }
    return settings;
  };

}]);
