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
