"use strict";

angular
  .module("gursoyVakfiAdmin.login", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/login", {
        templateUrl: "login/login.html",
        controller: "LoginCtrl"
      });
    }
  ])
  .controller("LoginCtrl", [
    "$scope",
    "$http",
    "$timeout",
    "$window",
    "$state",
    "appSettings",
    "userProfile",
    function(
      $scope,
      $http,
      $timeout,
      $window,
      $state,
      appSettings,
      userProfile
    ) {
      $scope.loginFormData = {};
      $scope.loginFormError = null;

      $scope.isLogged = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isLogged();

      $scope.isLoggedIn ? $state.go("dashboard") : $state.go("login");

      $scope.login = function() {
        if (this.loginForm.$valid) {
          $scope.loginFormError = null;
          $http
            .post(appSettings.serverUrl + "Auth/adminlogin", $scope.loginFormData)
            .then(
              function(response) {
                if (response.status == 200) {
                  userProfile.setProfile(
                    JSON.stringify({
                      timestamp: new Date(),
                      accessToken: response.data
                    })
                  );
                  angular.element("#loginModal2").modal("hide");
                  $timeout(function() {
                    $window.location.reload();
                  }, 500);
                }
              },
              function(response) {
                console.log(response);
                if (response.status == 401) {
                  $scope.loginFormError = "Kullanıcı adı veya şifre hatalı";
                } else if (response.status == 400) {
                  $scope.loginFormError = response.data;
                }
              }
            );
        }
      };
    }
  ]);
