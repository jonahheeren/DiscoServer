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

  describe('/POST message to chatroom', () => {
    it('it should add a message to a chatroom', (done) => {
      chai.request(index)
        .post('/sendmessage')
        .type('form')
        .send({ message: 'This is a test message', uid: '4231', nickname: 'testuser', 'chatroom_id': 0 })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          done();
      });
    });
  });

  describe('/POST message to chatroom with empty body', () => {
    it('it should return an error status code', (done) => {
      chai.request(index)
        .post('/sendmessage')
        .type('form')
        .send({})
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(400);
          done();
      });
    });
  });

  describe('/POST backup to settings table', () => {
    it('it should add an entry into the settings table', (done) => {
      chai.request(index)
        .post('/insertbackup')
        .type('form')
        .send({ uuid: 'test-uuid', arbitrage: true })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          done();
      });
    });
  });

  describe('/POST backup to settings table with empty body', () => {
    it('it should return an error status code', (done) => {
      chai.request(index)
        .post('/insertbackup')
        .type('form')
        .send({})
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(400);
          done();
      });
    });
  });

  describe('/GET Remove backup from table', () => {
    it('it should remove a backup from the settings table', (done) => {
      chai.request(index)
        .get('/removebackup')
        .query({ uuid: 'test-uuid' })
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          done();
      });
    });
  });

  describe('/GET backup to backup table with empty body', () => {
    it('it should return an error status code', (done) => {
      chai.request(index)
        .get('/removebackup')
        .query({})
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(400);
          done();
      });
    });
  });

});