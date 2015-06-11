angular.module('myApp').service('CountryService', ['$http', '$q', 'baseApi', 'QueryBuilderService', function ($http, $q, baseApi, QueryBuilderService) {

	var CountryService = {};

	var resourceUrl = baseApi + '/countries';
	var fields = null;

	function buildFields() {
		if (!fields) {
			fields = [
			{name: 'isoCode', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'description', type: 'string'}
				
			];
		}
		return fields;
	}

	//-- Public API -----

	CountryService.getCount =  function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.count = true;		
		return QueryBuilderService.buildBaucisQuery(opts).then(function(q) {
		    return $http.get(resourceUrl + q);
		}, function (err) {
		    return $q.reject(err);
		});
	};
	
	CountryService.getList = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		return QueryBuilderService.buildBaucisQuery(opts).then(function(q) {
		    return $http.get(resourceUrl + q);
		}, function (err) {
		    return $q.reject(err);
		});
	};

	function exportQuery(opts) {
		opts = opts || {};
		opts.paginate = false;
		opts.fields = opts.fields || buildFields();
		return QueryBuilderService.buildBaucisQuery(opts).then(function (q) {
		    return q;
		}, function (err) {
		    return $q.reject(err);
		});
	}

	CountryService.getListAsCsv = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/csv'} 
			});
		}, function (err) {
	        return $q.reject(err);
	    });
	};	

	CountryService.getFileAsCsv = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/csv'} 
			});
		}, function (err) {
	        return $q.reject(err);
	    });
	};	
	CountryService.getFileAsXml = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/xml'} 
			});
		}, function (err) {
	        return $q.reject(err);
	    });
	};		
	CountryService.getFileAsXlsx = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
				responseType: 'blob' 
			});
		}, function (err) {
	        return $q.reject(err);
	    });
	};		
	
	CountryService.get = function (link) {
		return $http.get(link);
	};
	
	CountryService.getDocument = function (id) {
		return CountryService.get(resourceUrl + '/' + id );
	};

	CountryService.add = function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	};

	CountryService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	CountryService.delete = function (id) {
		return $http.delete(resourceUrl + '/' + id);
	};

	CountryService.deleteMany = function (ids) {
		var msg = { 
			'ids'		: ids
		};	
		return $http.post(resourceUrl + '/deleteByIds', JSON.stringify(msg));
	};	

	CountryService.deleteByQuery = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.paginate = false;		
		return QueryBuilderService.buildBaucisQuery(opts).then(function (q) {
			return $http.delete(resourceUrl + q);
		}, function (err) {
		    return $q.reject(err);
		});
	};
	
	return CountryService;

}]);
