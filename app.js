"use strict";

angular
  .module("gursoyVakfiAdmin", [
    "angular-jwt",
    "ngRoute",
    "ui.router",
    "ngTable",
    "oitozero.ngSweetAlert",
    // "ng.ckeditor",
    "gursoyVakfiAdmin.login",
    "gursoyVakfiAdmin.dashboard",
    "gursoyVakfiAdmin.basvurular"
  ])
  .constant("appSettings", {
    serverUrl: "https://gursoyvakfi2.azurewebsites.net/api/"
  })
  .config([
    "$locationProvider",
    "$stateProvider",
    "$routeProvider",
    function($locationProvider, $stateProvider, $routeProvider) {
      // $locationProvider.hashPrefix("!");

      $stateProvider
        .state("login", {
          url: "/login",
          templateUrl: "login/login.html",
          controller: "LoginCtrl"
        })
        .state("basvurular", {
          url: "/basvurular",
          templateUrl: "basvurular/basvurular.html",
          controller: "BasvurularCtrl"
        })
        .state("dashboard", {
          url: "/dashboard",
          templateUrl: "dashboard/dashboard.html",
          controller: "DashboardCtrl"
        })
        .state("onay-bekleyenler", {
          url: "/onay-bekleyenler",
          templateUrl: "basvurular/onayBekleyenler.html",
          controller: "OnayBekleyenlerCtrl"
        })
        .state("red-olanlar", {
          url: "/red-olanlar",
          templateUrl: "basvurular/redOlanlar.html",
          controller: "RedOlanlarCtrl"
        })
        .state("onaylananlar", {
          url: "/onaylananlar",
          templateUrl: "basvurular/onaylananlar.html",
          controller: "OnaylananlarCtrl"
        })
        .state("tum-basvurular", {
          url: "/tum-basvurular",
          templateUrl: "basvurular/tumBasvurular.html",
          controller: "TumBasvurularCtrl"
        });

      $routeProvider.otherwise({ redirectTo: "/" });
    }
  ])
  .controller("IndexCtrl", [
    "$scope",
    "$http",
    "$state",
    "$window",
    "$timeout",
    "appSettings",
    "userProfile",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $window,
      $timeout,
      appSettings,
      userProfile,
      SweetAlert
    ) {
      $scope.sendEmailData = { Type: "Herkes" };
      $scope.sendSmsData = { Type: "Herkes" };
      $scope.systemStatus = false;
      $scope.sifreFormData = {};
      $scope.sifreFormError = {};
      $scope.isLogged = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isLogged();

      $scope.isLoggedIn ? $state.go("dashboard") : $state.go("login");

      $scope.logout = function() {
        if ($scope.isLoggedIn) userProfile.logout();
      };

      $http
        .post(appSettings.serverUrl + "admin/getsystem", null, {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200)
              $scope.systemStatus = response.data.Durum;
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      $scope.passwordSbmt = function(e) {
        e.preventDefault();
        $http
          .post(
            appSettings.serverUrl + "users/changepassword",
            $scope.sifreFormData,
            {
              headers: userProfile.getAuthHeaders()
            }
          )
          .then(
            function(response) {
              if (response.status == 200) {
                SweetAlert.swal(
                  {
                    title: "Başarılı",
                    text: response.data,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Tamam",
                    closeOnConfirm: false
                  },
                  function() {
                    $window.location.reload();
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400) $scope.sifreFormError = response.data;
            }
          );
      };

      $scope.changeSystemStatus = function(checkValue) {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text:
              "Sistem durumu değiştirilecektir. Devam etmek istiyor musunuz ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#30c13f",
            confirmButtonText: "Evet",
            cancelButtonText: "Hayır",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm) {
            if (isConfirm) {
              $http
                .post(
                  appSettings.serverUrl + "admin/system",
                  { Durum: checkValue },
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal(
                        "Sistem Durumu Değişti!",
                        "Sistem durumu başarılı bir şekilde değiştirildi.",
                        "success"
                      );
                      $timeout(function() {
                        $window.location.reload();
                      }, 1000);
                    }
                  },
                  function(response) {
                    if (response.status == 400)
                      SweetAlert.swal(
                        "Bir Sorun Oluştu!",
                        response.data,
                        "error"
                      );
                  }
                );
            } else {
              $window.location.reload();
            }
          }
        );
      };
    }
  ]);
