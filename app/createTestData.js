//Create test data for backend services
var mongoose = require('mongoose');

var models = require('./model');

var dbName = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/DemoDb';
mongoose.connect(dbName);


// Clear the database of old data
mongoose.model('user').remove(function (error) {
  if (error) {
  	throw error;
  }
});
mongoose.model('country').remove(function (error) {
  if (error) {
  	throw error;
  }
});

console.log('Data deleted on: ' + dbName);

// Put the fresh data in the database
//Data for User ---------------------------
console.log('  Creating data for  User.');

mongoose.model('user').create( {
		name: 'Name0',
		surname: 'Surname1',
		age: 20,
		isActive: false
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name4',
		surname: 'Surname5',
		age: 60,
		isActive: false
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name8',
		surname: 'Surname9',
		age: 100,
		isActive: false
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name12',
		surname: 'Surname13',
		age: 140,
		isActive: false
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name16',
		surname: 'Surname17',
		age: 180,
		isActive: false
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
//Data for Country ---------------------------
console.log('  Creating data for  Country.');

mongoose.model('country').create( {
		isoCode: 'IsoCode20',
		name: 'Name21',
		description: 'Description22'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('country').create( {
		isoCode: 'IsoCode23',
		name: 'Name24',
		description: 'Description25'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('country').create( {
		isoCode: 'IsoCode26',
		name: 'Name27',
		description: 'Description28'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('country').create( {
		isoCode: 'IsoCode29',
		name: 'Name30',
		description: 'Description31'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('country').create( {
		isoCode: 'IsoCode32',
		name: 'Name33',
		description: 'Description34'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);

console.log('Fake Data created on: ' + dbName);
