const request = require('request');


const rawRequest = (url, methodType, headers, params, callback) => {
	headers['User-Agent'] = 'CryptoDisco API Client';

	const options = { 
		url : url,
		method: methodType,
		headers: headers,
		form : params
	};
	console.log(options);
	request(options, function(err, response, body){
		if(err){
			callback(err)
		}
		//console.log(responseBody)
		responseBody = JSON.parse(body);
		
		if(responseBody.error && responseBody.error.length) {
			const error = responseBody.error
				.filter((e) => e.startsWith('E'))
				.map((e) => e.substr(1));

			if(!error.length) {
				throw new Error("API returned an unknown error");
				callback("API returned an unknown error")
			}

			throw new Error(error.join(', '));
		}
		callback(null, responseBody);
	});	
}

class Exchange {

	constructor() {
		this.methods = {
			public : [ 'allPairs', 	'orderBook', 'ticker'], 
			private : ['balance']
		}
	}

	api(method, params, callback) {
		var url = this.API_URL + this.API_VERSION_PATH

		if(this.methods.public.includes(method)) {
			url =  url + this.API_PUBLIC_PATH + this.pathMap.get(method)
			rawRequest(url, this.METHOD_TYPE, {}, params, callback);
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
		      realThis.handleAllPairs(response, function(err, response){
		      		res.send(response);
		      })
		    }
		});
	}
}

module.exports = Exchange;
