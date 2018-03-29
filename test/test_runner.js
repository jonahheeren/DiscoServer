var Mocha = require('mocha');
const sendmail = require('sendmail')();

var mocha = new Mocha({});

mocha.addFile('test/functional_tests/test_index.js');
mocha.addFile('test/unit_tests/test_arbitrage.js');

var report = 'Test Report:<br />';

mocha.run()
  .on('pass', function(test) {
    console.log('Test passed');
    report += '- Passed: ' + test.title + '<br />';
  })
  .on('fail', function(test, err) {
    console.log('Test fail');
    report += '- Failed: ' + test.title + '<br />';
  })
  .on('end', function() {
    sendmail({
      from: 'testy@CryptoDisco.com',
      to: 'jonah.heeren@me.com',
      subject: 'Test Report',
      html: report,
    }, function(err, reply) {
      if(err) {
        process.exit(-1);
      } else {
        process.exit(0);
      }
            
    });
});
