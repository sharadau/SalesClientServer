'use strict';

describe('Controller: EmailsViewCtrl', function () {

  // load the controller's module
  beforeEach(module('publicApp'));

  var EmailsViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailsViewCtrl = $controller('EmailsViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
