const request = require('request');
const qs     = require('qs');

const rawRequest = (url, methodType, headers, params, callback) => {
	headers['User-Agent'] = 'CryptoDisco API Client';

	const options = { 
		url : url,
		method: methodType,
		headers: headers,
		form : params
	};
	request(options, function(err, response, body){
		if(err){
			return callback("ERROR requesting: " + url);
		}
		responseBody = JSON.parse(body);
		callback(null,responseBody);
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
			rawRequest(url, this.METHOD_TYPE, {}, params, function(err, response){
				if(err) {
					return callback(err);
				}
				callback(null, response);
				
			});
		} else {
			return 'Method does not exist'
		}
	}

	getAllPairs(callback){
		const realThis = this;
		var pairs = this.api('allPairs', {}, function(err, response){
			if (err){
				return callback(err);
			} 
			realThis.handleAllPairs(response, function(err, response){
		    	callback(null, response);
		    });
		});
	}
}

module.exports = Exchange;
