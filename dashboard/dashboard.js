"use strict";

angular
  .module("gursoyVakfiAdmin.dashboard", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/dashboard", {
        templateUrl: "dashboard/dashboard.html",
        controller: "DashboardCtrl"
      });
    }
  ])
  .controller("DashboardCtrl", [
    "$scope",
    "$state",
    "$http",
    "appSettings",
    "userProfile",
    "SweetAlert",
    function($scope, $state, $http, appSettings, userProfile, SweetAlert) {
      $scope.currentWeather = {};
      $scope.forecastDays = {};
      $scope.dashboardData = {};
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("dashboard") : $state.go("login");

      $http
        .get(
          "https://api.apixu.com/v1/forecast.json?key=0ce128e233f74d629a6154649182412&q=Istanbul&lang=tr&days=7"
        )
        .then(
          function(response) {
            if (response.status == 200) {
              $scope.currentWeather = response.data.current;
              $scope.forecastDays = response.data.forecast.forecastday;
            }
          },
          function(response) {
            if (response.status == 400) SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      $http
        .get(appSettings.serverUrl + "admin/dashboard", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              $scope.dashboardData = response.data;
            }
          },
          function(response) {
            if (response.status == 400) SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );
    }
  ]);
