var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');

class Kucoin extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/tick', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.kucoin.com';
		this.API_VERSION_PATH = '/v1';
		this.API_PUBLIC_PATH = '/open';
		this.API_PRIVATE_PATH = '/private';


	}

    handleAllPairs(body, callback) {
        var pairs = [];
        for(var i = 0; i < body.data.length; i ++) {
            var element = {};
            element.coin = body.data[i].coinType;
            element.market = body.data[i].coinTypePair;
            element.price = body.data[i].lastDealPrice;
            element.volume = body.data[i].vol;
            
            pairs.push(element);
        }
        callback(null, pairs);
    }
}

module.exports = Kucoin;