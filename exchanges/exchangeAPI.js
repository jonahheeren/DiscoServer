const request = require('request');


const rawRequest = (url, methodType, headers, params, timeout, callback) => {
	headers['User-Agent'] = 'CryptoDisco API Client';

	const options = { 
		url : url,
		method: methodType,
		headers: headers,
		form : params
	};
	//console.log(options)
	request(options, function(err, response, body){
		if(err){
			callback(err)
			//console.log(err);
		}
		//console.log(body);
		responseBody = JSON.parse(body);
		
		if(responseBody.error && responseBody.error.length) {
			const error = responseBody.error
				.filter((e) => e.startsWith('E'))
				.map((e) => e.substr(1));

			if(!error.length) {
				throw new Error("Kraken API returned an unknown error");
				callback("Kraken API returned an unknown error")
			}

			throw new Error(error.join(', '));
		}
		//console.log("API data received")
		callback(null, responseBody);
	});	
}

class Exchange {

	constructor(key, secret, options) {
		// Allow passing the OTP as the third argument for backwards compatibility
		this.config = Object.assign({ key, secret });

		this.methods = {
			public : [ 'allPairs', 	'orderBook', 'ticker'], 
			private : ['balance']
		}
	}

	api(method, params, callback) {
		var url = this.API_URL + this.API_VERSION_PATH

		if(this.methods.public.includes(method)) {
			url =  url + this.API_PUBLIC_PATH + this.pathMap.get(method)
			//console.log(params)
			rawRequest(url, this.METHOD_TYPE, {}, params, this.config.timeout, callback);
			//this.publicMethod(url, this.METHOD_TYPE,{}, params, callback)
		} else {
			callback('Method does not exist')
		}
	}

	getAllPairs(req, res){
		const realThis = this;
		this.api('allPairs', {}, function(err, response){
		    if(err){
		      console.log(err);
		    } else {
		      console.log(this)
		      realThis.handleAllPairs(response, function(err, response){
		      		res.send(response);
		      })
		      //res.send(response);
		    }
		});
	}
}

module.exports = Exchange;
