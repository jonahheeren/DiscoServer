var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');

class Coinone extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/ticker?currency=all', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.coinone.co.kr';
		this.API_VERSION_PATH = '';
		this.API_PUBLIC_PATH = '';
		this.API_PRIVATE_PATH = '';


	}

    handleAllPairs(body, callback) {
        var response = Object.keys(body);
        var pairs = [];
        response.forEach(pair => {
			if(pair != "errorCode" && pair != "result" && pair != "timestamp") {
                var element = {};

                element.coin = pair.toUpperCase();
                element.market = 'KRW';
                element.price = body[pair].last;
                element.volume = body[pair].volume;

                pairs.push(element);
            }
		})
        callback(null, pairs);
    }
}

module.exports = Coinone;