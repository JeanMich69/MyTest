//Return configuration specific settings by deployment environment
var path = require('path');

function getConfiguration()
{
	var environment = (process.env.NODE_ENV || 'devel');
	return getConfigurationByEnv(environment);
}

function getConfigurationByEnv(environment)
{
	//Default configuration object
	var configuration = {
		environment: '',
		security: {
			rootAccount: 'admin',
			apiKey: 'icinetic', // The key to explore the API DOCS and use it from third-party hosts

			//set SERVER-SECRET var on production to a well-know value 
			serverSecret: process.env.SERVER_SECRET || "sample-symetric-key-2014" 
		},
		rootHttpDir: null,
		appPort: (process.env.VCAP_APP_PORT || process.env.PORT || 5000),
		appHost: (process.env.VCAP_APP_HOST || 'localhost'),
		staticCacheTime:  86400000 * 1,												// 1 day
		mongodbConnection: resolveMongoDbCnx()
	};

	if (environment === 'production') {
		//Override specific settings values for production  -------------
		configuration.environment = 'production';
	}
	else if (environment === 'qa') {
		//Override specific settings values for qa ----------------------
		configuration.environment = 'qa';
	}
	else {  
		//Default environment devel
		//Override specific settings values for devel -------------------
		configuration.environment = 'devel';
		configuration.staticCacheTime = 0; //disables cache for development
	}

	//-------------------------------------------------------------------
	if (configuration.environment === 'devel') {
	    configuration.rootHttpDir = path.normalize(__dirname + '/../../public');
	} 
	else {
	    configuration.rootHttpDir = path.normalize(__dirname + '/../../public-html/' + configuration.environment);
	}

	return configuration;
}

function resolveMongoDbCnx() {
	var dbName = 'DemoDb';
	var defaultCnx = 'mongodb://localhost:27017/' + dbName;

	if (process.env.DB_URI) {
		//Direct connection string via ENV.DB_URI
		return process.env.DB_URI;
	}  
	if (process.env.DB_NAME && process.env.DB_PORT) {
		//Docker link context passed via DB alias
		var protoTarget = process.env.DB_PORT; //Sample: DB_PORT=tcp://172.17.0.5:5432
		var target = protoTarget.substr(6);
		return 'mongodb://' + target + '/' + dbName;
	}
	if (process.env.VCAP_SERVICES) {
		//Cloud Foundry settings
		var vCap = JSON.parse(process.env.VCAP_SERVICES);

		if (vCap['mongodb-2.2']) {
			return vCap['mongodb-2.2'][0].credentials.url || defaultCnx;
		}
		else {
			return vCap['mongodb-2.4'][0].credentials.url || defaultCnx;
		}
	}
	//Mongolab URI
	return process.env.MONGOLAB_URI || defaultCnx;
}

module.exports.getConfiguration = getConfiguration;
module.exports.getConfigurationByEnv = getConfigurationByEnv;
