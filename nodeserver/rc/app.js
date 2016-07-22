var app = angular.module('angularApp', ['ngRoute' ]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/remote', {
      templateUrl: '/partials/remote.html',
      controller: 'RemoteController'
    }).
    when('/config', {
      templateUrl: '/partials/config.html',
      controller: 'ConfigController'
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

app.controller('ConfigController', function ($rootScope, $scope, $http, $location ) {
  $scope.morseStatus = false;
  $scope.ssid="BernardFAST";
  $scope.password="1212121212";

  $scope.onStart = function() {
    var configString = String.fromCharCode(0x55) + String.fromCharCode(0xAA) + $scope.ssid + "|" + $scope.password
      + String.fromCharCode(0xAA) + String.fromCharCode(0x55) ;

    var getNext = function() {
      if (configString.length == 0) {
        return 0;
      }
      var nextChar = configString.substring(0,1);
      configString = configString.substring(1);
      return nextChar.charCodeAt(0);
    }

    console.log(configString)

    $scope.counter = 0;
    $scope.sending = true;
    $scope.bits = null;

    $scope.intervalCounter = setInterval(function() {
      if ($scope.bits == null) {
        var char = getNext();
        if (char == 0) {
          delete($scope.sending);
          clearInterval($scope.intervalCounter);
        } else {
          console.log(char.toString(16));
        }
        $scope.bits = (char).toString(2);
      } else {
        console.log($scope.bits)
        $scope.bits = null;
      }

      // $scope.morseStatus = !$scope.morseStatus;
      // if ($scope.morseStatus) {
      //   $scope.counter++
      //   console.log($scope.counter)
      // }
      // console.log("Counter:"+$scope.counter);
      // if ($scope.counter > 10) {
      //   delete($scope.sending);
      //   clearInterval($scope.intervalCounter);
      // }
      // $scope.$apply();
    },10)
  }


});
