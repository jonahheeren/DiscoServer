var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap')
const crypto = require('crypto');
const qs     = require('qs');

class Kraken extends Exchange{
	constructor(){
		super();
		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/AssetPairs', 'balance', '/Balance', 'ticker', '/Ticker', 'orderBook', '/Depth')

		this.METHOD_TYPE="POST";
		this.API_URL = 'https://api.kraken.com';
		this.API_VERSION_PATH = '/0';
		this.API_PUBLIC_PATH = '/public'
		this.API_PRIVATE_PATH = '/private'

		

	}

	handleAllPairs(body, callback) {
		var response = Object.keys(body.result)
		var pairs = [];

		for(var key in body.result) {
			if(!body.result.hasOwnProperty(key)) continue;
			var element = {};
			var obj = body.result[key];
			element.market = obj.base;
			element.coin = obj.quote;
			pairs.push(element);
		}
		callback(null, pairs);
	}
}

module.exports = Kraken;