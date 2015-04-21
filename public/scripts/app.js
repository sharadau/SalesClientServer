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
            domain: 'salesdashboard-auth0-com.eu.auth0.com',
            clientID: 'Kx8VE59Tz6rFa8go8pNAXf4oboVpEqZ9',
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
      .state('auth.home', {
        url: "/home",
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
      })
      .state("prospect", {
        url: "/prospect",
        templateUrl: "views/prospect.html",
        controller: "ProspectCtrl"
      })
      .state("prospect.edit", {
        url: "/edit/:prospectId/:stage",
        templateUrl: "views/prospect.edit.html",
        controller: "ProspectEditCtrl"
      })
      .state("prospect.view", {
        url: "/view/:prospectId",
        templateUrl: "views/prospect.view.html",
        controller: "ProspectViewCtrl"
      })
      .state("participant", {
        url: "/participant/:participantId",
        templateUrl: "views/participant.html",
        controller: "ParticipantCtrl"
      })
      .state("participant.list", {
        url: "/list/:prospectId/:prospectName",
        templateUrl: "views/participant.list.html",
        controller: "ParticipantListCtrl"
      })
      .state("emails", {
        url: "/emails",
        templateUrl: "views/emails.html",
        controller: "EmailsCtrl"
      })
      .state("emails.edit", {
        url: "/edit/:prospectId/:prospectName/:from/:stage",
        templateUrl: "views/emails.edit.html",
        controller: "EmailsEditCtrl"
      })
      .state("emails.list", {
        url: "/list",
        templateUrl: "views/emails.list.html",
        controller: "EmailsListCtrl"
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
