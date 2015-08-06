'use strict';

/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
angular
  .module('dashboardApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'chart.js',
        'angularFileUpload',
        'auth0',
        'angular-storage',
        'angular-jwt'
  ]).config(function($stateProvider, $urlRouterProvider,authProvider, jwtInterceptorProvider,$httpProvider) {
    //
    // For any unmatched url, redirect to /state1
    //$urlRouterProvider.otherwise("/home");
    //
        authProvider.init({
            domain: 'salesdashboard.eu.auth0.com',
            clientID: '4giAC9q7kSxqgPbuh0cnv7p7cgtf310i',
            callbackUrl: location.href,
            loginState: 'login'
        })
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('token');
        }
        $httpProvider.interceptors.push('jwtInterceptor');
    // Now set up the states
    $stateProvider
        .state("login",{
            templateUrl:"views/login.html",
            controller:"LoginCtrl",
            url:"/login"
        })
        .state("auth",{
            templateUrl:"views/authenticated.html",
            controller:"AuthCtrl",
            abstract: true,
            data: {
                requiresLogin: true
            }
        })
    .state('auth.dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.html",
        controller: "DashboardCtrl"
      })
        .state('auth.chart', {
            url: "/chart",
            templateUrl: "views/chart.html",
            controller: "ChartCtrl"
        })
      .state('auth.home', {
        url: "/home",
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
      })
      .state("auth.prospect", {
        url: "/prospect",
        templateUrl: "views/prospect.html",
        controller: "ProspectCtrl"
      })
      .state("auth.prospect.edit", {
        url: "/edit/:prospectId/:stage",
        templateUrl: "views/prospect.edit.html",
        controller: "ProspectEditCtrl"
      })
      .state("auth.prospect.view", {
        url: "/view/:prospectId",
        templateUrl: "views/prospect.view.html",
        controller: "ProspectViewCtrl"
      })
      .state("auth.participant", {
        url: "/participant/:participantId",
        templateUrl: "views/participant.html",
        controller: "ParticipantCtrl"
      })
      .state("auth.participant.list", {
        url: "/list/:prospectId/:prospectName",
        templateUrl: "views/participant.list.html",
        controller: "ParticipantListCtrl"
      })
        .state("auth.cycle", {
            url: "/cycles/:cycleId",
            templateUrl: "views/cycle.html",
            controller: "CycleCtrl"
        })
        .state("auth.cycle.list", {
            url: "/list/:prospectId/:prospectName",
            templateUrl: "views/cycles.list.html",
            controller: "CycleListCtrl"
        })
      .state("auth.emails", {
        url: "/emails",
        templateUrl: "views/emails.html",
        controller: "EmailsCtrl"
      })
      .state("auth.emails.edit", {
        url: "/edit/:prospectId/:prospectName/:from/:stage/:cycle_id/:cycle_no",
        templateUrl: "views/emails.edit.html",
        controller: "EmailsEditCtrl"
      })
      .state("auth.emails.list", {
        url: "/list",
        templateUrl: "views/emails.list.html",
        controller: "EmailsListCtrl"
      })
        .state("auth.emails.ulist", {
            url: "/ulist",
            templateUrl: "views/emails.list.html",
            controller: "EmailsUListCtrl"
        })
        .state("auth.emails.uncategorizedEmailsForProspect", {
            url: "/uncategorizedEmailsForProspect/:prospect_id",
            templateUrl: "views/emails.list.html",
            controller: "EmailsListCtrl"
        })
        .state("auth.emails.view", {
            url: "/view/:pId",
            templateUrl: "views/emails.view.html",
            controller: "EmailsViewCtrl"
        }) .state("auth.emails.details", {
            url: "/details",
            templateUrl: "views/email_popover.html",
            controller: "EmailsUListCtrl"
        })
        .state("auth.settings", {
            url: "/settings",
            templateUrl: "views/settings.html",
            controller: "SettingsCtrl"
        })
        .state("auth.settings.edit", {
            url: "/edit",
            templateUrl: "views/settings.edit.html",
            controller: "SettingsEditCtrl"
        }).state("auth.settings.view", {
            url: "/view",
            templateUrl: "views/settings.view.html"
        })
        .state("auth.employee", {
            url: "/employee",
            templateUrl: "views/employee.html",
            controller: "EmployeeCtrl"
        })
        .state("auth.employee.edit", {
            url: "/edit",
            templateUrl: "views/employee.edit.html",
            controller: "EmployeeEditCtrl"
        })
        // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
        // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
        // want to check the delegation-token example
        $httpProvider.interceptors.push('jwtInterceptor');
    }).run(function($rootScope, auth, store, jwtHelper, $state) {
        $rootScope.$on('$locationChangeStart', function() {
            if (!auth.isAuthenticated) {
                var token = store.get('token');
                if (token) {
                    if (!jwtHelper.isTokenExpired(token)) {
                        auth.authenticate(store.get('profile'), token);
                    } else {
                        //$location.path('/login');
                        $state.go("login");
                    }
                }
            }
        });
    })

    .run(function($state,auth){
        auth.hookEvents();
        $state.go("auth.home");
    })
