var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap')
const crypto = require('crypto');
const qs     = require('qs');

const KEY  = '8k7pV8MLQjQT+vBpbHrZDYOmBepz2t1IDIznxzcdiA+i9WlMU0V71w/8'; // API Key
const SECRET  = 'UTJwQjFBmDmw94U9Qn/hC4vbTh2oU3C4iLDie59SioxwRk6N6zLShmVnKnXpNPky0tSQv1+lc/7eLCgIkDZWeQ=='; // API Private Key

class Kraken extends Exchange{
	constructor(){
		super(KEY, SECRET, {});
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
		console.log(pairs.length);
		callback(null, pairs);
	}

	hello(){
		console.log("hello")
	}
}

module.exports = Kraken;