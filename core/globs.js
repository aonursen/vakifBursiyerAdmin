(function() {
  "use strict";
  angular.module("gursoyVakfiAdmin").service("globs", [
    "$http",
    "$timeout",
    "userProfile",
    "appSettings",
    function($http, $timeout, userProfile, appSettings) {

      this.showMsgModal = function(msg) {
        angular
          .element("#msgModalBody")
          .html("")
          .append("<h6 class='text-center'>" + msg + "</h6>");
        angular.element("#msgModal").modal("show");
      };
    }
  ]);
})();
