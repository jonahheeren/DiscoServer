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
			var element = {};
			var obj = body.result[key];
			var market = obj.base;
			var coin = obj.quote;

			if(market[0] === 'X' || market[0] === 'Z')
				market = market.substring(1);
			if(coin[0] === 'X' || coin[0] === 'Z')
				coin = coin.substring(1);

			element.market = market;
			element.coin = coin;
			pairs.push(element);
		}
		callback(null, pairs);
	}
}

module.exports = Kraken;