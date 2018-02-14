var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap')
var request = require('request')
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
		var pairString = "";

		//Get a comma separated string with all the pairs
		for(var key in response)
			if(key === '0') {
				pairString = response[key]
			}
			else {
				pairString = pairString + ", " + response[key]
			}

		
		var params = {}
		params.pair = pairString;

		//Call the ticker API with the string created before as param
		this.api('ticker', params, function(err, response){
			var keysObject = Object.keys(response.result);

			var pairs =[];
			var i = 0;
			for(var key in response.result) {
				var obj = response.result
				var element = {};
				var market="";
				var coin ="";

				//DEAL WITH THE COIN'S SHORTNAMES
				if(keysObject[i].length === 8) {
					coin = keysObject[i].substring(0,4)
					market = keysObject[i].substring(4)
				} else if(keysObject[i].length === 7) {
					coin = keysObject[i].substring(0,4)
					market = keysObject[i].substring(4)
				}
				else if(keysObject[i].length === 6) {
					coin = keysObject[i].substring(0,3)
					market = keysObject[i].substring(3)
				}

				//DEAL WITH THE PRICES AND VOLUMES
				element.market = market;
				element.coin = coin;
				element.price = obj[key].c[0];
				element.volume = obj[key].v[0];
				pairs.push(element);
			
				i ++;

			}
			callback(null, pairs)
		})
	}
}

module.exports = Kraken;