var mysql = require('mysql'),
    nconf = require('nconf');

nconf.file({
  file: './config/config.json'
  });
  
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
  }


var connection = mysql.createConnection({
  host     : nconf.get('mysql').host,
  user     : nconf.get('mysql').user,
  password : nconf.get('mysql').password,
  database : nconf.get('mysql').database
});

connection.connect();

executeQuery = (query, parameters) => {
  return new Promise((resolve, reject) => {
    connection.query(query, parameters, function (error, results, fields) {
      if(error) {
        console.log(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

exports.checkUser = uuid => {
  return executeQuery('SELECT * FROM User WHERE UUID = ?', uuid);
}

exports.getUsers = uuid => {
  return executeQuery('SELECT * FROM User WHERE UUID = ?', uuid);
}

exports.addUser = query => {
  return executeQuery('INSERT INTO User VALUES(?, ?, Now())', [query.uuid, query.fcm_token]);
}

exports.insertStop = (body) => {
  return executeQuery('INSERT INTO Stops (coin_short, market_short, exchange, size, price, side, is_executed, UUID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                        [body.coinShort, body.marketShort, body.exchange, body.size, body.price, parseInt(body.side), 0, body.uuid]);
}

exports.insertTrailingStop = (body, marketPrice) => {
  return executeQuery('INSERT INTO TrailStops (coin_short, market_short, exchange, trail, market_price, size, side, is_executed, UUID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      [body.coinShort, body.marketShort, body.exchange, body.trail, marketPrice, body.size, parseInt(body.side), 0, body.uuid]);
}

exports.insertPairs = (pairs) => {
  return executeQuery('INSERT INTO Pairs (coin_short, market_short, price, exchange) VALUES ? ON DUPLICATE KEY UPDATE price=VALUES(price)',
                        [pairs]);
}

exports.getStops = () => {
  return executeQuery('SELECT * FROM Stops WHERE is_executed = 0', []);
}

exports.getTrails = () => {
  return executeQuery('SELECT * FROM TrailStops WHERE is_executed = 0', []);
}

exports.insertAllPairs = (pairs) => {
  return executeQuery('INSERT IGNORE INTO AllPairs (coin_short, market_short) VALUES ?',
                        [pairs]);
}

exports.addsub = (body) => {
  return executeQuery('INSERT IGNORE INTO SubChats (UUID, chatroom_id) VALUES (?, ?)',
                        [body.uuid, body.chatroom_id]);
}

exports.updateTrailMarketPrice = (price, coinShort, marketShort, exchange) => {
  return executeQuery('UPDATE TrailStops SET market_price = ? WHERE coin_short = ? AND market_short = ? AND exchange = ?',
                      [price, coinShort, marketShort, exchange]);
}

exports.updateFCMToken = (query) => {
  return executeQuery('UPDATE User SET fcm_token = ? WHERE UUID = ?', [query.fcm_token, query.uuid]);
}

exports.getArbitrageDevices = () => {
  return executeQuery('SELECT * FROM User WHERE fcm_token is not null', []);
}

exports.getNotifications = (uuid) => {
  return executeQuery('SELECT * FROM Notifications WHERE UUID = ?', [uuid]);
}


exports.markStop = (id) => {
  return executeQuery('UPDATE Stops SET is_executed = 1 WHERE id = ?', [id]);
}

exports.markTrail = (id) => {
  return executeQuery('UPDATE TrailStops SET is_executed = 1 WHERE id = ?', [id]);
}

exports.getPair = (coinShort, marketShort, exchange) => {
  return executeQuery('SELECT * FROM Pairs WHERE coin_short = ? AND market_short = ? AND exchange = ?', [coinShort, marketShort, exchange]);
}

exports.PairExists = (coinShort, marketShort, exchange) => {
  console.log('coinshort: ' + coinShort);
  console.log('marketshort: ' + marketShort);
  console.log('exchange: ' + exchange);
  return executeQuery('SELECT * FROM Pairs WHERE coin_short = ? AND market_short = ? and exchange = ?', [coinShort, marketShort, exchange]);
}

exports.getPairsByExchange = (exchange) => {
  return executeQuery('SELECT * FROM Pairs WHERE exchange = ?', [exchange]);
}

exports.getCoinOnExchanges = (coinShort) => {
  return executeQuery('SELECT * FROM Pairs WHERE market_short = ?', [coinShort]);
}



exports.getPair =(coin_short, market_short) => {
  return executeQuery('SELECT * FROM Pairs WHERE coin_short = ? AND market_short = ?', [coin_short, market_short]);
}

exports.getPairs = () => {
  return executeQuery('SELECT * FROM Pairs', []);
}

exports.getAllPairs = () => {
  return executeQuery('SELECT * FROM AllPairs', []);
}

exports.getExchanges = () => {
  return executeQuery('SELECT * FROM Exchanges', []);
}

exports.getCoins = () => {
  return executeQuery('SELECT * FROM Coins', []);
}

exports.getChatrooms = () => {
  return executeQuery('SELECT * FROM ChatRoom', []);
}

exports.getSubscribers = (chatroom_id) => {
  return executeQuery('SELECT * FROM User WHERE uuid IN (SELECT uuid FROM SubChats WHERE chatroom_id = ?)', [chatroom_id]);
}
/*
exports.getChatMessages = (roomId) => {
  return executeQuery('SELECT * FROM ChatMsgs WHERE chatroom_id = ?', [roomId]);
}
*/

exports.getChatMessages = (roomId) => {
  return executeQuery('SELECT * FROM ChatMsgs WHERE chatroom_id = ?', [roomId]);
}

exports.sendMessage = (message) => {
  return executeQuery('INSERT INTO ChatMsgs(message, uid, nickname, chatroom_id) VALUES(?, ?, ?, ?)', [message.message, message.uid, message.nickname, message.chatroom_id]);
}

exports.insertBackup = (backup) => {
  return executeQuery('INSERT INTO Settings(uuid, arbitrage) VALUES(?, ?)', [backup.uuid, backup.arbitrage]);
}

exports.removeBackup = uuid => {
  return executeQuery('DELETE FROM Settings WHERE uuid = ?', uuid);
}

exports.getCoinLikeCount = (watchlist) => {
  return executeQuery('SELECT COUNT(*) AS count FROM WatchList WHERE user = ? AND coin = ?', [watchlist.user, watchlist.coin]);
}

exports.insertCoinLike = (watchlist) => {
  return executeQuery('INSERT INTO WatchList(user, coin) VALUES(?, ?)', [watchlist.user, watchlist.coin]);
}

exports.removeCoinLike = (watchlist) => {
  return executeQuery('DELETE FROM WatchList WHERE user = ? AND coin = ?', [watchlist.user, watchlist.coin]);
}

exports.getWatchlists = () => {
  return executeQuery('SELECT * FROM WatchList', []);
}

