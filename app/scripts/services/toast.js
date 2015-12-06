/**
 * Created by ezimonczyk on 27/11/15.
 */

'use strict';

app.service('ToastService', function() {

  function generateToast(message,type,duration){

    var toast = document.createElement('div'),
        paragraph = document.createElement('p');

    toast.setAttribute('class','toast '+type);
    paragraph.innerHTML = message;
    toast.appendChild(paragraph);
    document.body.appendChild(toast);

    setTimeout(function(){
      document.body.removeChild(toast);
    },duration);
  }

  this.showToast = function(message,type,duration) {

    generateToast(message,type,duration);
  };

  this.showServerToast = function(json,type,duration) {

    var message = "";
    for(var parameter in json){
      if(json.hasOwnProperty(parameter)) {
        if(parameter != 'error') {
          var temp = "";
          for (var i = 0; i < json[parameter].length; i++) {
            temp += json[parameter][i] + " ";
          }
          message += parameter + " " + temp + "</br>";
        } else {
          message = json[parameter];
        }
      }
    }
    if(!json){
      message = "Error!";
    }

    generateToast(message,type,duration);
  };



});
