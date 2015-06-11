angular.module('myApp').controller('DeleteCountryController', ['$scope', '$routeParams', '$location', 'CountryService', function($scope, $routeParams, $location, CountryService) {

	function init() {
		$scope.country = {};
		$scope.dataReceived = false;

		if($location.path() !== '/country/delete') {
			CountryService.getDocument($routeParams.id).then(function (httpResponse) {
				$scope.country = httpResponse.data;
				$scope.dataReceived = true;
			});
		} else {
			$scope.dataReceived = true;
		}
	}

	$scope.delete = function () {
		CountryService.delete($scope.country._id).then(function () {
			$location.path('/country/');
		});
	};

	$scope.cancel = function () {
		$location.path('/country/');
	};

	init();

}]);
