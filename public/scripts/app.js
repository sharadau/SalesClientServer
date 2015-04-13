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
    'chart.js'
  ]).config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    //$urlRouterProvider.otherwise("/home");
    //
    // Now set up the states
    $stateProvider
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.html",
        controller: "DashboardCtrl"
      })
      .state('home', {
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
  })
  .run(function($state){
    $state.go("home");
  })
