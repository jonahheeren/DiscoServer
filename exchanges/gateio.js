var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');

class Gateio extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/tickers', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://data.gate.io';
		this.API_VERSION_PATH = '/api2/1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = '/private'


	}

	handleAllPairs(body, callback) {
		var response = Object.keys(body);
		var pairs = [];

		response.forEach(pair => {
			var i = pair.indexOf('_');
			
			var element = {};

			element.coin = pair.substring(0,i).toUpperCase();
			element.market = pair.substring(i+1).toUpperCase();
			element.price = body[pair].last;
			element.volume = body[pair].baseVolume;

			pairs.push(element);
		})
		callback(null, pairs);
	}
}

module.exports = Gateio;