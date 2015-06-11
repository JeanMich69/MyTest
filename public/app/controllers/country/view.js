angular.module('myApp').controller('ViewCountryController', ['$scope', '$routeParams', '$location', 'CountryService', function($scope, $routeParams, $location, CountryService) {

	function init() {
		$scope.country = {
			isoCode : null, 
			name : null, 
			description : null 
		
		};
		$scope.dataReceived = false;

		CountryService.getDocument($routeParams.id).then(function (httpResponse) {
			$scope.country = httpResponse.data;
			$scope.dataReceived = true;
		});

	}

	$scope.gotoList = function (event) {
		$location.path('/country/');
	};	
	$scope.edit = function (event) {
		$location.path('/country/edit/' + $scope.country._id );
	};

	init();

}]);
