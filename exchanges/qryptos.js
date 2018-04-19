var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');

class Qryptos extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/products', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.quoine.com';
		this.API_VERSION_PATH = '';
		this.API_PUBLIC_PATH = '';
		this.API_PRIVATE_PATH = '';


	}

    handleAllPairs(body, callback) {
        var pairs = [];
        
        for(var i in body) {
            var element = {};
            var pair = body[i];

            element.coin = pair.base_currency;
            element.market = pair.quoted_currency;
            element.price = pair.last_traded_price;
            
            element.volume = pair.volume_24h;

            pairs.push(element);

        }
        callback(null, pairs);
    }
}

module.exports = Qryptos;