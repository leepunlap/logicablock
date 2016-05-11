var app = angular.module('angularApp', ['ngRoute' ]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/remote', {
      templateUrl: '/partials/remote.html',
      controller: 'RemoteController'
    }).
    otherwise({
      redirectTo: '/remote'
    });
  }]);

app.run(function($rootScope, $http) {

})

app.controller('RemoteController', function ($rootScope, $scope, $http) {
  console.log("lalalala")
});

