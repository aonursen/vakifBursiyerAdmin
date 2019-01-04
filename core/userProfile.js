(function() {
  "use strict";
  angular.module("gursoyVakfiAdmin").service("userProfile", [
    "$timeout",
    "$interval",
    "$window",
    "jwtHelper",
    function($timeout, $interval, $window, jwtHelper) {
      this.isSessionExpired = function() {
        return jwtHelper.isTokenExpired(token);
      };

      this.setProfile = function(data) {
        sessionStorage.setItem("userInfo", data);
      };

      this.isLoggedIn = function() {
        return sessionStorage.getItem("userInfo") != null;
      };

      this.isLoggedAsAdmin = function() {
        var token = JSON.parse(sessionStorage.getItem("userInfo"));
        if (token) {
          token = token.accessToken;
          var userRole = jwtHelper.decodeToken(token);
          userRole = userRole.role;
          return userRole == 'Manager';
        }
      };

      this.getToken = function() {
        return sessionStorage.getItem("userInfo");
      };

      this.getAuthHeaders = function() {
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        var authHeaders = {};
        if (userInfo) {
          authHeaders = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userInfo.accessToken
          };
        }
        return authHeaders;
      };

      function logout() {
        sessionStorage.removeItem("userInfo");
        $window.location.reload();
      }

      this.logout = function() {
        logout();
      };
    }
  ]);
})();
