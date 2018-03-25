process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let index = require('../../index.js');
const uuidv4 = require('uuid/v4');

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHttp);

describe('DiscoServer API', () => {

  describe('/GET exchange Binance', () => {
    it('it should GET all Binance pairs', (done) => {
      chai.request(index)
        .get('/exchange/binance/allPairs')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].coin_short.should.be.a('string');
          res.body[0].market_short.should.be.a('string');
          res.body[0].price.should.be.a('Number');
          expect(res.body[0].exchange).to.equal('Binance');
          done();
      });
    });
  });

  describe('/GET exchange GateIO', () => {
    it('it should GET all GateIO pairs', (done) => {
      chai.request(index)
        .get('/exchange/gateio/allPairs')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].coin_short.should.be.a('string');
          res.body[0].market_short.should.be.a('string');
          res.body[0].price.should.be.a('Number');
          expect(res.body[0].exchange).to.equal('gateio');
          done();
      });
    });
  });

  describe('/GET exchange Kraken', () => {
    it('it should GET all Kraken pairs', (done) => {
      chai.request(index)
        .get('/exchange/Kraken/allPairs')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].coin_short.should.be.a('string');
          res.body[0].market_short.should.be.a('string');
          res.body[0].price.should.be.a('Number');
          expect(res.body[0].exchange).to.equal('Kraken');
          done();
      });
    });
  });

  describe('/GET user', () => {
    it('it should add User and then validate', (done) => {
      let generated_uuid = uuidv4();
      chai.request(index)
        .get('/user')
        .query({uuid: generated_uuid})
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(204);

          chai.request(index)
            .get('/user')
            .query({uuid: generated_uuid})
            .end((err, res) => {
              expect(err).to.be.null;
              res.should.have.status(200);
            });

          done();
      });
    });
  });

  describe('/GET arbitrage', () => {
    it('it should get all possible arbitrage oppurtunities', (done) => {
      chai.request(index)
        .get('/arbitrage')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          if(res.body.length > 0) {
            res.body[0].first.coin_short.should.be.a('string');
            res.body[0].first.market_short.should.be.a('string');
            res.body[0].first.price.should.be.a('Number');
            res.body[0].first.exchange.should.be.a('string');

            res.body[0].second.coin_short.should.be.a('string');
            res.body[0].second.market_short.should.be.a('string');
            res.body[0].second.price.should.be.a('Number');
            res.body[0].second.exchange.should.be.a('string');

            res.body[0].pcntDiff.should.be.a('Number');
          }
          done();
      });
    });
  });

  describe('/GET exchanges', () => {
    it('it should get all possible exchanges', (done) => {
      chai.request(index)
        .get('/exchanges')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].name.should.be.a('string');
          res.body[0].url.should.be.a('string');
          done();
      });
    });
  });

  describe('/GET chatrooms', () => {
    it('it should get all available chatrooms', (done) => {
      chai.request(index)
        .get('/chatrooms')
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.be.a('Number');
          res.body[0].name.should.be.a('string');
          res.body[0].description.should.be.a('string');
          done();
      });
    });
  });

  describe('/GET chatmessages', () => {
    it('it should get all chatmessages for a chatroom', (done) => {
      chai.request(index)
        .get('/chatmessages')
        .query({ room: 0 })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.id.should.be.a('Number');
          res.body.message.should.be.a('string');
          res.body.uid.should.be.a('string');
          res.body.nickname.should.be.a('string');
          expect(res.body.chatroom_id).to.equal(0);
          done();
      });
    });
  });

  describe('/GET chatmessages with bad id', () => {
    it('it should return 404 not found', (done) => {
      chai.request(index)
        .get('/chatmessages')
        .query({ room: 193203100 })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(404);
          done();
      });
    });
  });

  describe('/GET coin', () => {
    it('it should return all markets for a coin', (done) => {
      chai.request(index)
        .get('/coin')
        .query({ shortname: 'BTC' })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].coin_short.should.be.a('string');
          res.body[0].price.should.be.a('Number');
          res.body[0].exchange.should.be.a('string');
          expect(res.body[0].market_short).to.equal('BTC');
          done();
      });
    });
  });

  describe('/GET coin with bad shortname', () => {
    it('it should return 404 not found', (done) => {
      chai.request(index)
        .get('/coin')
        .query({ shortname: 'ASDFASDF' })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(404);
          done();
      });
    });
  });

});