var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');
const crypto = require('crypto');
const qs     = require('qs');

var KEY = '28BC9CC6-EC99-48CB-AB29-4456DA6FCAE2';
var SECRET = 'a7ac0fea3039afc62d862e029640ddd9fa67998afcbd3b48ca7034651e97c983';
class Gateio extends Exchange{
	constructor(){
		super(KEY, SECRET, {});

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/pairs', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://data.gate.io';
		this.API_VERSION_PATH = '/api2/1';
		this.API_PUBLIC_PATH = ''
		this.API_PRIVATE_PATH = '/private'


	}

	handleAllPairs(body, callback) {
		var response = Object.keys(body)
		var pairs = [];

		for (var i = 0; i < body.length; i ++) {
			//console.log(body[i])
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