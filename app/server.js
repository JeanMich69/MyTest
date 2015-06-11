// Services backend for SampleBackend
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AppNow (http://appnow.radarconline.com) 
//     Code-gen engine version: 4.6.0.34725 
//     MEAN generator version:  1.0.10
//     at:                      6/11/2015 3:40:29 PM UTC
// </auto-generated>
//------------------------------------------------------------------------------

//Set the enviroment variable NODE_ENV = devel | qa | production to select the running enviroment. Default: devel
var environment = (process.env.NODE_ENV || 'devel');
var configuration = require('./conf/configuration').getConfiguration(environment);

var S = require('string');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var baucis = require('baucis');
var swagger = require('baucis-swagger');
var swagger2 = require('baucis-swagger2');

var models = require('./model');

mongoose.connect(configuration.mongodbConnection, {}, connectionCallback);

function connectionCallback(err, db) {
    if (err) {
        console.error('Error: Invalid Database Connection');
        console.error(err);
    }
}

//Extend baucis with new operations via decorators and formatters -------
require('./services/baucis-csv.js').apply(baucis);
require('./services/decorators').apply(baucis);

// Create the express app 
var app = express();

//Configure app -------------------------------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(morgan('dev'));
app.use(compression({
    threshold: 512
}));  
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cookieParser());
app.use(session({ 
    secret: configuration.security.apiKey,
    resave: true,
    saveUninitialized: true
}));

// Create the API routes & controllers  ---------------------------
var controllers = [];
Object.keys(models.models).forEach(function(key) { 
    var item = models.models[key];
    var controller = baucis.rest(item.name, item.model);
    item.controller = controller;
    controllers.push(controller);
});

//Add domain services -----------------------------------------------
require('./services/authz').apply(app, models, configuration);
require('./services/swaggerDoc').apply(controllers);
require('./services/import').apply(app);
require('./services/general').apply(app, models, configuration);
require('./services/webhooks').apply(controllers);
//---------------------------------------------------------------------


var baucisInstance = baucis();
var swagger2Options = {
    title: 'SampleBackend'    
};
require('./services/swagger2Doc').apply(baucisInstance, controllers, swagger2Options);

//Launch -------------------------------
app.use('/api', baucisInstance);
app.use('/', express.static(configuration.rootHttpDir, { 
    maxAge: configuration.staticCacheTime 
}));

app.listen(configuration.appPort);

console.log('SampleBackend Backend - Server listening on: '+ 
            configuration.appHost + ':' + configuration.appPort + 
            ' Environment: '+ configuration.environment);

Object.keys(models.models).forEach(function(key) { 
    var resource = models.models[key];
    console.log('\tResource ' + S(resource.name).padRight(30) +' on   /api/' + resource.plural);
});
console.log('\tSwagger 1.1 API docs                    on   /api/documentation');
console.log('\tSwagger 2.0 API docs                    on   /api/swagger.json');
console.log('\tAngularJS admin web-client              on   /');
console.log('\tServing public files from:                   ' + configuration.rootHttpDir);
console.log('Application up and ready.');

