const cheerio = require('cheerio');
var request = require('request');

exports.exchangeVolume = () => {
  return new Promise(function(resolve, reject) {
    request('https://coinmarketcap.com/exchanges/volume/24-hour/', function (error, response, body) {
      const $ = cheerio.load(body);

      var data = [];
      var ref = $('tr[id]');

      $('tr[id]').each(function(index, element) {
        data.push({
          index: index,
          exchange: $(element).attr('id'),
          price: $(ref.get(index + 1)).prev().find('td[class="bold text-right volume"]').text() == "" ? $(ref.get(index + 1)).prev().find('td[class="text-right bold volume"]').text()  : $(ref.get(index + 1)).prev().find('td[class="bold text-right volume"]').text() 
        });
      });

      data[data.length - 1].price = $('td[class="text-right bold volume"]').last().text();

      resolve(data);
    });
  });
}
