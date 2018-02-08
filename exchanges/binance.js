var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');

class Binance extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/exchangeInfo', 'balance', '/balances', 'orderBook', '/orderBook')

		
		https://api.binance.com/api/v1/exchangeInfo
		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.binance.com';
		this.API_VERSION_PATH = '/api/v1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = ''


	}

	handleAllPairs(body, callback) {
		var pairs = [];
		for(var key in body.symbols){
			var element = {};
			var obj = body.symbols[key];
			element.market = obj.quoteAsset;
			element.coin = obj.baseAsset;
			
			pairs.push(element);
			//console.log(body.symbols[key].baseAsset)
		}
		callback(null, pairs);
	}
}

module.exports = Binance;