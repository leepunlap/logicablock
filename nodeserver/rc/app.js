var app = angular.module('angularApp', ['ngRoute' ]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/remote', {
      templateUrl: '/partials/remote.html',
      controller: 'RemoteController'
    }).
    when('/closed', {
      templateUrl: '/partials/closed.html',
      controller: 'RemoteController'
    }).
    otherwise({
      redirectTo: '/remote'
    });
  }]);

app.run(function($rootScope, $http) {

})

app.controller('RemoteController', function ($rootScope, $scope, $http, $location ) {
  $scope.onClick = function(b) {
    var oid = $location.search().o;
    console.log(b)
    console.log(oid)
    socket.emit('remote', { oid: oid, button: b });
  }
});

