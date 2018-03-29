process.env.NODE_ENV = 'test';

let arbitrage = require('../../helpers/arbitrage.js');

let chai = require('chai');
let expect = chai.expect;

let fixtures = require('../fixtures/arbitrage_fixtures.js');

describe('Arbitrage Unit Tests', () => {
  describe('Valid data arbitrage', () => {
    it('it should return the percent diffs on arbitrage pairs', (done) => {
      let result = arbitrage.performArbitrage(fixtures.allPairs, fixtures.pairs);
      expect(result).to.deep.equal(fixtures.expectedResult);
      done();
    });
  });

  describe('Empty data arbitrage', () => {
    it('it should return an empty array', (done) => {
      let result = arbitrage.performArbitrage([], []);
      expect(result).to.deep.equal([]);
      done();
    });
  });

  describe('Garbage data arbitrage', () => {
    it('it should return an empty array', (done) => {
      let result = arbitrage.performArbitrage([{  
        "asdf":"ABT",
        "fdsaf":"USDT"
        }], [{
           "fdsa":"ABT",
           "dfsfafsdfaf":"USDT"
        }]);
      expect(result).to.deep.equal([]);
      done();
    });
  });
});
