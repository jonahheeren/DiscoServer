var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');


class Binance extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/ticker/price', 'balance', '/balances', 'orderBook', '/orderBook')

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.binance.com';
		this.API_VERSION_PATH = '/api/v1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = ''


	}

	handleAllPairs(body, callback) {
		var pairs = [];
		var response = body;
		//callback(null, body);
		//console.log(body);
		for(var item in body){
			var element = {};
			var market="";
			var coin ="";

			//Handle different pair string lengths
			if(response[item].symbol.length == 8) {
				coin = response[item].symbol.substring(0,4)
				market = response[item].symbol.substring(4)
			} else if(response[item].symbol.length == 7) {
				if(response[item].symbol.substring(3) === "USDT") {
					coin = response[item].symbol.substring(0,3)
					market = response[item].symbol.substring(3)
				} else {
					coin = response[item].symbol.substring(0,4)
					market = response[item].symbol.substring(4)
				}
			} else if(response[item].symbol.length == 6) {
				coin = response[item].symbol.substring(0,3)
				market = response[item].symbol.substring(3)
			}

			element.market = market;
			element.coin = coin;
			element.price = response[item].price;
			element.volume = 0;
			pairs.push(element);
		}
		callback(null, pairs);
	}
}

module.exports = Binance;