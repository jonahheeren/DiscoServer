var Twitter = require('twitter');
nconf = require('nconf');

nconf.file({
  file: './config/config.json'
  });
  
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
  }

var t_client = new Twitter({
    consumer_key : nconf.get('twitter').consumer_key,
    consumer_secret : nconf.get('twitter').consumer_secret,
    access_token_key : nconf.get('twitter').access_token_key,
    access_token_secret : nconf.get('twitter').access_token_secret
});

exports.getTweets = (params) => {
    return new Promise((resolve, reject) => {

        t_client.get('search/tweets', params, function(error, tweets, response) {
            if(error) {
                reject(error);
            }
            var tweet_data = [];

            for (i = 0; i < tweets.statuses.length; i++) {
                tweet_data[i] = { id: tweets.statuses[i]};
            }
            resolve(tweet_data);
        });
    });
}
