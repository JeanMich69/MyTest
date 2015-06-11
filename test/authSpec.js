
var assert = require('assert');
var sut = require("../app/conf/configuration");

describe('Configuration', function(){
	describe('security.apikey', function(){
		it('is defined', function(){
			assert.equal(false, sut.getConfiguration().security.apiKey == undefined);
			assert.equal(false, sut.getConfiguration().security.apiKey == null);
		});
		it('has value', function(){
			assert.equal(false, sut.getConfiguration().security.apiKey == '');
		});
	});
});
