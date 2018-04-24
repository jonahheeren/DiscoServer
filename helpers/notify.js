var FCM = require('fcm-node'),
    nconf = require('nconf');

nconf.file({
  file: './config/config.json'
  });
  
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
  }

var fcm = new FCM(nconf.get('FCM').server_key);

exports.sendTestMessage = () => {
  return new Promise((resolve, reject) => {
    var testmessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: 'fQLCoYfuaOw:APA91bGCmUx9WjQo8GauRVLOX5MGgSEjvVjT9qFJnmkQm1rV4FpRPxX6q0qaSa8rlahCqaGZ8wTAkwFIIynqg8o3UL7BEIRhPmi56upXCAcxWc9qk5PcKISH29HUbsot2t31fZ07MKd1', 

      
      notification: {
          title: 'CryptoDisco', 
          body: 'Incoming node shit' 
      }
    }

    fcm.send(testmessage, function(err, response) {
        if (err) {
            reject(err);
        } else {
            resolve(response);
        }
    });
  });
}

exports.sendMessage = (users, body_text) => {
  var fcm_tokens = []

  users.forEach(user => {
    fcm_tokens.push(user.fcm_token);
  });

  return new Promise((resolve, reject) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      registration_ids: fcm_tokens,

      
      notification: {
          title: 'arbitrage', 
          type: 0,
          body: JSON.stringify(body_text) 
      }
    }

    fcm.send(message, function(err, response) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response);
        }
    });
  });
}

exports.sendChatMessage = (users, chatroom_id, uuid, body_text) => {
  var fcm_tokens = []

  users.forEach(user => {
    fcm_tokens.push(user.fcm_token);
  });

  return new Promise((resolve, reject) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      registration_ids: fcm_tokens,

      
      data: {
        type: 0,
        uuid: uuid,
        chatroom_id: chatroom_id, 
        body: JSON.stringify(body_text) 
      }
    }

    fcm.send(message, function(err, response) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(response);
          resolve(response);
        }
    });
  });
}

exports.sendTradeMessage = (user, coin_short, market_short, exchange, size, price, side) => {
  return new Promise((resolve, reject) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: user.fcm_token,

      
      data: {
        type: 1,
        coin_short: coin_short,
        market_short: market_short,
        exchange: exchange,
        size: size,
        side: side
      }
    }

    fcm.send(message, function(err, response) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(response);
          resolve(response);
        }
    });
  });
}
