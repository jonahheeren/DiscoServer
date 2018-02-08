var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');

class Gateio extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/pairs', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://data.gate.io';
		this.API_VERSION_PATH = '/api2/1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = '/private'


	}

	handleAllPairs(body, callback) {
		var pairs = [];

		for (var i = 0; i < body.length; i ++) {
			var element = {};
			var part = body[i].split("_")
			element.market = part[1];
			element.coin = part[0];
			pairs.push(element);
		
		}
		callback(null, pairs);
	}
}

module.exports = Gateio;