var Exchange = require('./exchangeAPI');
var HashMap = require('hashmap');

class Hitbtc extends Exchange{
	constructor(){
		super();

		this.pathMap = new HashMap();
		this.pathMap.multi('allPairs','/ticker', 'balance', '/balances', 'orderBook', '/orderBook')

		

		this.METHOD_TYPE="GET";
		this.API_URL = 'https://api.hitbtc.com';
		this.API_VERSION_PATH = '/api/2';
		this.API_PUBLIC_PATH = '/public';
		this.API_PRIVATE_PATH = '';


	} 

    handleAllPairs(body, callback) {
        var pairs = [];
        //console.log(body);
        for(var i = 0; i < body.length; i ++) {
            var element = {};
            var coin = "";
            var market = "";
            var sym = body[i].symbol;
            var temp = sym.substring(sym.length - 3);

            if(temp == "SDT") {
                coin = sym.substring(0,sym.length - 4);;
                market = sym.substring(sym.length - 4);
            } else {
                coin = sym.substring(0,sym.length - 3);;
                market = sym.substring(sym.length - 3);
            }
            
            element.coin = coin;
            element.market = market;
            element.price = body[i].last;
            element.volume = body[i].volume;
            pairs.push(element);
        }
        callback(null, pairs);
    }
}

module.exports = Hitbtc;