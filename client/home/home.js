angular.module('domain.home', ['ui.bootstrap','ui.utils','ui.router','ngAnimate'])
.config(function($stateProvider) {
	$stateProvider.state('homepage', {
		url: '/home',
		templateUrl: 'home/home.html',
		controller: 'HomeCtrl'
	});
})
.controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
	function getDomainName(domain) {
  	var parts = domain.split('.').reverse();
    var cnt = parts.length;
    if (cnt >= 3) {
    // see if the second level domain is a common SLD.
    	if (parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|info|biz)$/i)) {
      	return parts[2] + '.' + parts[1] + '.' + parts[0];
      }
    }
    return parts[1]+'.'+parts[0];
   }

	var domainName = getDomainName($location.host());
	$scope.domain = {
		name: domainName,
		price: 0
	}
	$scope.domainOthers = [];
	$scope.$on('$viewContentLoaded', function(){
		var domainsURL = "http://"+domainName+"/api/domains";
  	$http.get(domainsURL).
  		success(function(data, status, headers, config){
  			var entry;
  			for (var i = data.length - 1; i >= 0; i--) {
  					if((entry = data[i]).Name === domainName){
  						console.log("find it: " + entry.Name);
  						$scope.domain.price = $scope.offer.bid = entry.StartingPrice;
  					}else{
  						$scope.domainOthers.push(entry);
  					}
	  		};
  		}).
  		error(function(data, status, headers, config){
  				alert("Get data failed!");
  		});
  });
	$scope.offer = {
		name: "Tell me your name please",
		email: "youremail@",
		bid: 0,
		host: domainName
	};
	$scope.clearText = function(arg){
		console.log("Clear Text:" + arg);
		for (key in $scope.offer){
			if($scope.offer[key] === arg){
				$scope.offer[key] = null;
			}
		};
	};
	$scope.offerSend = function(offerForm){
		if (!offerForm.$valid) {
			alert("Submitting form is invalid");
			return;
		}
		var offerURL = "http://"+domainName+"/sendoffer";
		var responsePromise = $http.post(offerURL, $scope.offer, {});
    responsePromise.success(function(dataFromServer, status, headers, config) {
    	alert("Submitting form successed!");
    });
    responsePromise.error(function(data, status, headers, config) {
    	alert("Submitting form failed!");
    });
   };
}]);

