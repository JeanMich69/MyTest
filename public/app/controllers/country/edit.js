angular.module('myApp').controller('EditCountryController', ['$scope', '$routeParams', '$location', '$translate', 'UserErrorService', 'CountryService', function($scope, $routeParams, $location, $translate, UserErrorService, CountryService) {

	$scope.isEdition = false;
	$scope.isCreation = false;
	$scope.isDeletion = false;
	$scope.isView = false;
	$scope.readOnly = false;
	$scope.dataReceived = false;
	$scope.obj = {
		isoCode : null, 
		name : null, 
		description : null 
		
	};

	$scope.add = function () {
		CountryService.add($scope.obj)
		              .then(gotoList, errorHandlerAdd);
	};
	$scope.update = function () {
		CountryService.update($scope.obj)
	              	  .then(gotoList, errorHandlerUpdate);
	};
	$scope.delete = function () {
		CountryService.delete($scope.obj._id)
		              .then(gotoList, errorHandlerDelete);		
	};
	function errorHandlerAdd(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "add");
	}
	function errorHandlerUpdate(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}
	function errorHandlerDelete(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "delete");
	}
	function errorHandlerLoad(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	function loadData(httpResponse) {
		$scope.obj = httpResponse.data;
		$scope.errors = null;
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		gotoList();
	};
	$scope.gotoEdit = function() {
		$location.path('/country/edit/' + $routeParams.id);		
	};
	$scope.gotoDelete = function() {
		$location.path('/country/delete/' + $routeParams.id);		
	};
	function gotoList() {
		$location.path('/country/');		
	}

	function init() {
		$scope.isDeletion = isDeletionContext();
		$scope.isView     = isViewContext();
		$scope.readOnly   = $scope.isDeletion || $scope.isView;

		if ($routeParams.id) {
			$scope.isEdition = !$scope.readOnly;
			$scope.isCreation = false;

			CountryService.getDocument($routeParams.id)
				.then(loadData, errorHandlerLoad);
		} else {
			$scope.isEdition = false;
			$scope.isCreation = true;
			$scope.dataReceived = true;
		}
	}
	function isDeletionContext() {
		return stringContains($location.path(), '/delete/');
	}
	function isViewContext() {
		return stringContains($location.path(), '/view/');
	}
	function stringContains(text, substring) {
		return text.indexOf(substring) > -1;
	}

	init();

}]);
