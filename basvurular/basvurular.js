"use strict";

angular
  .module("gursoyVakfiAdmin.basvurular", ["ngRoute", "ngTable"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider
        .when("/basvurular", {
          templateUrl: "basvurular/basvurular.html",
          controller: "BasvurularCtrl"
        })
        .when("/onay-bekleyenler", {
          templateUrl: "basvurular/onayBekleyenler.html",
          controller: "OnayBekleyenlerCtrl"
        })
        .when("/red-olanlar", {
          templateUrl: "basvurular/redOlanlar.html",
          controller: "RedOlanlarCtrl"
        })
        .when("/onaylananlar", {
          templateUrl: "basvurular/onaylananlar.html",
          controller: "OnaylananlarCtrl"
        })
        .when("/tum-basvurular", {
          templateUrl: "basvurular/tumBasvurular.html",
          controller: "TumBasvurularCtrl"
        });
    }
  ])
  .controller("BasvurularCtrl", [
    "$scope",
    "$http",
    "$state",
    "$timeout",
    "$window",
    "appSettings",
    "globs",
    "userProfile",
    "NgTableParams",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $timeout,
      $window,
      appSettings,
      globs,
      userProfile,
      NgTableParams,
      SweetAlert
    ) {
      $scope.kisiselData = {};
      $scope.egitimData = {};
      $scope.aileData = {};
      $scope.maliData = {};
      $scope.belgeData = {};
      $scope.gecmisBursData = {};
      $scope.selectedUser = null;
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("basvurular") : $state.go("login");

      $http
        .get(appSettings.serverUrl + "admin/users", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              var data = response.data;
              $scope.tableParams = new NgTableParams({}, { dataset: data });
            }
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      this.setSelectedUser = function(user) {
        $scope.selectedUser = user;
        $scope.kisiselData = {};
        $scope.egitimData = {};
        $scope.aileData = {};
        $scope.maliData = {};
        $scope.belgeData = {};
        $scope.gecmisBursData = {};
        this.getBursiyerKisisel();
      };

      this.getBursiyerKisisel = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getkisisel",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.kisiselData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerEgitim = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getegitim",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.egitimData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerAile = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getaile",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.aileData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerMali = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getmali",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.maliData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerBelge = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getbelge",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.belgeData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerGecmisBurs = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/oldpayments",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.gecmisBursData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.firstConfirmToUser = function() {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text:
              "Bursiyer ön onaydan geçirilecektir. Devam etmek istiyor musunuz ?",
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
                  appSettings.serverUrl + "admin/firstconfirmed",
                  $scope.selectedUser,
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal("Onaylandı!", response.data, "success");
                      $timeout(function() {
                        $window.location.reload();
                      }, 2000);
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
              SweetAlert.swal("Vazgeçildi!", "Ön onaydan vazgeçildi", "error");
            }
          }
        );
      };

      this.deniedToUser = function() {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text: "Bursiyer red edilecektir. Devam etmek istiyor musunuz ?",
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
                  appSettings.serverUrl + "admin/userdenied",
                  $scope.selectedUser,
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal("Red Edildi!", response.data, "success");
                      $timeout(function() {
                        $window.location.reload();
                      }, 2000);
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
              SweetAlert.swal(
                "Vazgeçildi!",
                "Red edilmekten vazgeçildi",
                "error"
              );
            }
          }
        );
      };

      $scope.viewDoc = function(docName) {
        var format = docName + "Format";
        var file =
          "data:" +
          $scope.belgeData[format] +
          ";base64," +
          $scope.belgeData[docName];
        angular
          .element("#viewDocModalBody")
          .html("")
          .append(
            '<iframe src="' + file + '" height="720" width="100%"></iframe>'
          );
        angular.element("#viewDocModal").modal("show");
      };
    }
  ])
  .controller("OnayBekleyenlerCtrl", [
    "$scope",
    "$http",
    "$state",
    "$timeout",
    "$window",
    "globs",
    "appSettings",
    "userProfile",
    "NgTableParams",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $timeout,
      $window,
      globs,
      appSettings,
      userProfile,
      NgTableParams,
      SweetAlert
    ) {
      $scope.kisiselData = {};
      $scope.egitimData = {};
      $scope.aileData = {};
      $scope.maliData = {};
      $scope.belgeData = {};
      $scope.gecmisBursData = {};
      $scope.selectedUser = null;
      $scope.bursMiktari = null;
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("onay-bekleyenler") : $state.go("login");

      $http
        .get(appSettings.serverUrl + "admin/confirmeduser", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              var data = response.data;
              $scope.tableParams = new NgTableParams({}, { dataset: data });
            }
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      this.setSelectedUser = function(user) {
        $scope.selectedUser = user;
        $scope.kisiselData = {};
        $scope.egitimData = {};
        $scope.aileData = {};
        $scope.maliData = {};
        $scope.belgeData = {};
        $scope.gecmisBursData = {};
        this.getBursiyerKisisel();
      };

      this.getBursiyerKisisel = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getkisisel",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.kisiselData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerEgitim = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getegitim",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.egitimData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerAile = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getaile",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.aileData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerMali = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getmali",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.maliData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerBelge = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getbelge",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.belgeData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerGecmisBurs = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/oldpayments",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.gecmisBursData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.deniedUser = function() {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text: "Bursiyer red edilecektir. Devam etmek istiyor musunuz ?",
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
                  appSettings.serverUrl + "admin/userdenied",
                  $scope.selectedUser,
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal("Red Edildi!", response.data, "success");
                      $timeout(function() {
                        $window.location.reload();
                      }, 2000);
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
              SweetAlert.swal(
                "Vazgeçildi!",
                "Red edilmekten vazgeçildi",
                "error"
              );
            }
          }
        );
      };

      this.confirmUser = function() {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text: "Bursiyer onaylanacaktır. Devam etmek istiyor musunuz ?",
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
                  appSettings.serverUrl + "admin/payconfirmed",
                  {
                    UserId: $scope.selectedUser.UserId,
                    BursMiktari: $scope.bursMiktari
                  },
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal("Onaylandı!", response.data, "success");
                      $timeout(function() {
                        $window.location.reload();
                      }, 2000);
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
              SweetAlert.swal("Vazgeçildi!", "Onaydan vazgeçildi", "error");
            }
          }
        );
      };

      $scope.viewDoc = function(docName) {
        var format = docName + "Format";
        var file =
          "data:" +
          $scope.belgeData[format] +
          ";base64," +
          $scope.belgeData[docName];
        angular
          .element("#viewDocModalBody")
          .html("")
          .append(
            '<iframe src="' + file + '" height="720" width="100%"></iframe>'
          );
        angular.element("#viewDocModal").modal("show");
      };
    }
  ])
  .controller("RedOlanlarCtrl", [
    "$scope",
    "$http",
    "$state",
    "$timeout",
    "$window",
    "globs",
    "appSettings",
    "userProfile",
    "NgTableParams",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $timeout,
      $window,
      globs,
      appSettings,
      userProfile,
      NgTableParams,
      SweetAlert
    ) {
      $scope.kisiselData = {};
      $scope.egitimData = {};
      $scope.aileData = {};
      $scope.maliData = {};
      $scope.belgeData = {};
      $scope.gecmisBursData = {};
      $scope.selectedUser = null;
      $scope.bursMiktari = null;
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("red-olanlar") : $state.go("login");

      $http
        .get(appSettings.serverUrl + "admin/getdenied", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              var data = response.data;
              $scope.tableParams = new NgTableParams({}, { dataset: data });
            }
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      this.setSelectedUser = function(user) {
        $scope.selectedUser = user;
        $scope.kisiselData = {};
        $scope.egitimData = {};
        $scope.aileData = {};
        $scope.maliData = {};
        $scope.belgeData = {};
        $scope.gecmisBursData = {};
        this.getBursiyerKisisel();
      };

      this.getBursiyerKisisel = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getkisisel",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.kisiselData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerEgitim = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getegitim",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.egitimData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerAile = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getaile",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.aileData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerMali = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getmali",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.maliData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerBelge = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getbelge",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.belgeData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerGecmisBurs = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/oldpayments",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.gecmisBursData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.firstConfirmToUser = function() {
        SweetAlert.swal(
          {
            title: "Emin Misiniz ?",
            text: "Bursiyer ön onaydan geçirilecektir onaylıyor musunuz ?",
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
                  appSettings.serverUrl + "admin/firstconfirmed",
                  $scope.selectedUser,
                  { headers: userProfile.getAuthHeaders() }
                )
                .then(
                  function(response) {
                    if (response.status == 200) {
                      SweetAlert.swal("Onaylandı!", response.data, "success");
                      $timeout(function() {
                        $window.location.reload();
                      }, 2000);
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
              SweetAlert.swal("Vazgeçildi!", "Ön onaydan vazgeçildi", "error");
            }
          }
        );
      };

      $scope.viewDoc = function(docName) {
        var format = docName + "Format";
        var file =
          "data:" +
          $scope.belgeData[format] +
          ";base64," +
          $scope.belgeData[docName];
        angular
          .element("#viewDocModalBody")
          .html("")
          .append(
            '<iframe src="' + file + '" height="720" width="100%"></iframe>'
          );
        angular.element("#viewDocModal").modal("show");
      };
    }
  ])
  .controller("OnaylananlarCtrl", [
    "$scope",
    "$http",
    "$state",
    "$timeout",
    "$window",
    "globs",
    "appSettings",
    "userProfile",
    "NgTableParams",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $timeout,
      $window,
      globs,
      appSettings,
      userProfile,
      NgTableParams,
      SweetAlert
    ) {
      $scope.kisiselData = {};
      $scope.egitimData = {};
      $scope.aileData = {};
      $scope.maliData = {};
      $scope.belgeData = {};
      $scope.gecmisBursData = {};
      $scope.selectedUser = null;
      $scope.bursMiktari = null;
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("onaylananlar") : $state.go("login");

      $http
        .get(appSettings.serverUrl + "admin/getpayment", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              var data = response.data;
              $scope.tableParams = new NgTableParams({}, { dataset: data });
            }
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      this.setSelectedUser = function(user) {
        $scope.selectedUser = user;
        $scope.kisiselData = {};
        $scope.egitimData = {};
        $scope.aileData = {};
        $scope.maliData = {};
        $scope.belgeData = {};
        $scope.gecmisBursData = {};
        this.getBursiyerKisisel();
      };

      this.getBursiyerKisisel = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getkisisel",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.kisiselData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerEgitim = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getegitim",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.egitimData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerAile = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getaile",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.aileData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerMali = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getmali",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.maliData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerBelge = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getbelge",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.belgeData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerGecmisBurs = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/oldpayments",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.gecmisBursData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      $scope.viewDoc = function(docName) {
        var format = docName + "Format";
        var file =
          "data:" +
          $scope.belgeData[format] +
          ";base64," +
          $scope.belgeData[docName];
        angular
          .element("#viewDocModalBody")
          .html("")
          .append(
            '<iframe src="' + file + '" height="720" width="100%"></iframe>'
          );
        angular.element("#viewDocModal").modal("show");
      };
    }
  ])
  .controller("TumBasvurularCtrl", [
    "$scope",
    "$http",
    "$state",
    "$timeout",
    "$window",
    "appSettings",
    "globs",
    "userProfile",
    "NgTableParams",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $timeout,
      $window,
      appSettings,
      globs,
      userProfile,
      NgTableParams,
      SweetAlert
    ) {
      $scope.kisiselData = {};
      $scope.egitimData = {};
      $scope.aileData = {};
      $scope.maliData = {};
      $scope.belgeData = {};
      $scope.gecmisBursData = {};
      $scope.selectedUser = null;
      $scope.isAuthenticated = function() {
        $scope.isLoggedIn = userProfile.isLoggedAsAdmin();
      };
      $scope.isAuthenticated();

      $scope.isLoggedIn ? $state.go("tum-basvurular") : $state.go("login");

      $http
        .get(appSettings.serverUrl + "admin/allapplication", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) {
              var data = response.data;
              $scope.tableParams = new NgTableParams({}, { dataset: data });
            }
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      this.setSelectedUser = function(user) {
        $scope.selectedUser = user;
        $scope.kisiselData = {};
        $scope.egitimData = {};
        $scope.aileData = {};
        $scope.maliData = {};
        $scope.belgeData = {};
        $scope.gecmisBursData = {};
        this.getBursiyerKisisel();
      };

      this.getBursiyerKisisel = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getkisisel",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.kisiselData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerEgitim = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getegitim",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.egitimData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerAile = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getaile",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.aileData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerMali = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getmali",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.maliData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerBelge = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/getbelge",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.belgeData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      this.getBursiyerGecmisBurs = function() {
        $http
          .post(
            appSettings.serverUrl + "admin/oldpayments",
            { UserId: $scope.selectedUser.UserId },
            { headers: userProfile.getAuthHeaders() }
          )
          .then(
            function(response) {
              if (response.status == 200) $scope.gecmisBursData = response.data;
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      $scope.viewDoc = function(docName) {
        var format = docName + "Format";
        var file =
          "data:" +
          $scope.belgeData[format] +
          ";base64," +
          $scope.belgeData[docName];
        angular
          .element("#viewDocModalBody")
          .html("")
          .append(
            '<iframe src="' + file + '" height="720" width="100%"></iframe>'
          );
        angular.element("#viewDocModal").modal("show");
      };
    }
  ]);
