
// var db = require('./db');
// var heroesClass = require('./heroes');
// var assert = require('assert');

const chai = require('chai'),
	chaiHttp = require('chai-http'),
	mocha = require('mocha'),
	sinon = require('sinon'),
	db = require('../db'),
	heroesClass = require('../heroes'),
	server = require('../server'),
	assert = chai.assert;

chai.should();
chai.use(chaiHttp);

describe('Heroes', function()
{
	describe('#getHeroes()', function()
	{
		it('should return all heroes', function()
		{
			const heroes = new heroesClass.Heroes();
			assert.equal(db.heroes,heroes.getHeroes());
		});
	});

	describe('#getHeroById()', function()
	{
		it('should return hero with same id', function()
		{
			const heroes = new heroesClass.Heroes();
			assert.equal(db.heroes.find(element => element.id === 5),heroes.getHeroById(5));
		});
	});

	describe('#addHero()', function()
	{
		it('should add hero', function()
		{
			const heroes = new heroesClass.Heroes();
			const hero = {id:15,name:"lol"};
			heroes.addHero(hero);
			assert.equal(db.heroes.find(element => element.id === 15),hero);
		});
	});

	describe('#deleteHeroById()', function()
	{
		it('should delete hero with same id', function()
		{
			const heroes = new heroesClass.Heroes();
			heroes.heroesDB = [{id:15,name:"lol"},{id:11,name:"df"}];
			heroes.deleteHeroById(15);
			const heroAfterDelete = heroes.heroesDB.find(element => element.id ===15);
			assert.equal(heroAfterDelete,undefined);
		});
	});

	describe('#updateHeroName()', function()
	{
		it('should update hero name ', function()
		{
			const heroes = new heroesClass.Heroes();
			heroes.heroesDB = [{id:15,name:"lol"},{id:11,name:"df"}];
			const heroBeforeUpdate = heroes.heroesDB.find(element => element.id ===15);
			let hero = {id:15,name:"lol"};
			heroes.updateHeroName(hero);
			const heroAfterUpdate = heroes.heroesDB.find(element => element.id ===15);
			assert.equal(heroAfterUpdate,heroBeforeUpdate);
		});
	});

	describe('GET', function () {
		it('should get all heroes', function (done) {
			const heroes = {};
			heroes.getHeroes = sinon.stub();
			heroes.getHeroes.returns([{id: 4, name: 'Bombasto'},
				{id: 5, name: 'Celeritas'},
				{id: 6, name: 'Magneta'}]);
			server.setHeroes(heroes);
			chai.request(server.httpServer)
				.get('/heroes')
				.end(function (err, res) {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be(3);
					done();
				});
		});
	});

	describe('Post', function () {
		it('should add hero', function (done) {
			const heroes = {};
			heroes.addHero = sinon.spy();
			heroes.getHeroById = sinon.stub();
			heroes.getHeroById.withArgs(15).returns({"id": "15", "name": "oz"});

			server.setHeroes(heroes);
			chai.request(server.httpServer)
				.post('/heroes')
				.send({"id": "15", "name": "oz"})
				.end(function (err, res) {
					res.should.have.status(200);
					heroes.addHero.callCount.should.equal(1);
					// res.body.should.be.a('json');
					// res.body.id.should.have.equal('15');
					// res.body.name.should.equal('oz');
					//res.body.length.should.be(11);
					done();
				});
		});
	});


});




after('after all', () => {
	server.httpServer.close();
});