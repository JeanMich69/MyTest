angular.module('myApp').service('MetadataService', [function () {
	var MetadataService = {};


	var metaData = {
		"user" 		: 	["name","surname","age","isActive"],
		"country" 		: 	["isoCode","name","description"]	};

	MetadataService.getPropertiesFor = function (className) {
		return (metaData[className] || [] ).slice(0);
	};

	MetadataService.getResourceList = function() {
		return [{
			key: 'users',
			value: 'Users'	
		}, {
			key: 'countries',
			value: 'Countries'	
		}];
	};

	return MetadataService;

}]);
