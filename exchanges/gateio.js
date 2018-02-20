var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');

class Gateio extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/marketList', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://data.gate.io';
		this.API_VERSION_PATH = '/api2/1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = '/private'


	}

	handleAllPairs(body) {
		var pairs = [];

		for (var key in body.data) {
			var element = {};
			var obj = body.data
			element.market = obj[key].curr_b;
			element.coin = obj[key].curr_a;
			element.price = obj[key].rate;
			element.volume = obj[key].vol_b;


			pairs.push(element);

		
		}
		return pairs;
	}
}

module.exports = Gateio;