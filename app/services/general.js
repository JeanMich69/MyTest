function apply(app, models, configuration) {

	//General error handler -- log error
	app.use(function(err, req, res, next) {
		console.error(req.query);
		console.error(err.stack);
	});

	//config-----
	app.post('/api/setConfigKey', function(req, res){
		console.log("SetKey:");
	 	try {
			var item = {
			      'key': req.body.key,
			      'value': req.body.value
			    };
			var model = models.models._config.model;

			console.log("SetKey: " + item.key + '=' + item.value);

			//delete all entries with the same key.
			model.remove({ 'key': item.key }, function (err, doc) {
				if (err) {
					console.err(err);
				}				
			});

			//create setting
			var newDoc = new model({
			  'key': item.key,
			  'value': item.value
			});
			newDoc.save();

			res.status(200)
			   .set('Content-Type', 'text/json')
			   .send('{}');

		}
		catch (e) {
			res.status(501)
			   .set('Content-Type', 'text/json')
			   .send('{ "error" : "' + e.message + '"}');
		}
	});

	//Save webkhooks ---
	app.post('/api/saveHooks', function(req, res){
		try {
		    var hooks = req.body.items;
		    var whModel = models.models._webhooks.model;
		    console.log("Save hooks: " + hooks.length + " received.");

		    //delete all previous entries
		    whModel.remove({ }, function (err, doc) {
				if (err) {
					console.err(err);
				}
		    });

			//persist all hooks
			for(var i in hooks) {
				var item = hooks[i];

				console.log(JSON.stringify(item));

				var newDoc = new whModel({
					resource : item.resource,
					operation : item.operation,
					httpMethod : item.httpMethod,
					urlTemplate : item.urlTemplate,        
					parameters : buildParams(item.parameters)
				});
				newDoc.save();
			}

			res.status(200)
			   .set('Content-Type', 'text/json')
			   .send('{}');
	 	}
	  	catch (e) {
	    	res.status(501)
	       		.set('Content-Type', 'text/json')
	       		.send('{ "error" : ' + e + '}');
	  	}
	});

	function buildParams(params) {
		var result = [];
		if (params != null) {
			params.forEach(function(item) {
				result.push({
					type: item.type,
					key: item.key,
					value: item.value
				});
			});
		}
		return result;
	}

	//Ping service for heartbeat (public) - to check if service is alive
	app.get('/ping', function(req, res) {
		res.status(200)
		   .set('Cache-Control', 'no-cache')
		   .send({ msg: 'pong' })
		   .end();
	});

	//Health Status service: rewrite to verify the health of your microservice
	app.get('/api/status', function(req, res) {
		serviceStatus(function status(err, status) {
			return res.status(err ? 500 : 200)
				      .set('Cache-Control', 'no-cache')
				      .send(status)
				      .end();	
		});
	});

	//Rewrite to verify the health of your microservice
	function serviceStatus(callback) {
		if (configuration.error) {
			//fatal error
			return callback(true, {
				status: 'malfunction',
				error: '' + configuration.error
			});
		}
		//check mongoDB is available with a simple query
		var configModel = models.models._config.model;
		configModel.findOne({}, function(err, data) {
			if (err) {
				return callback(true, {
					status: 'malfunction',
					error: err
				});
			}
			return callback(false, {
					status: 'operational'
				});
		});
	}

}
module.exports.apply = apply;