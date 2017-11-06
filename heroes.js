var db = require('./db');

class Heroes {

	constructor()
	{
		this.heroesDB = db.heroes;
	}

	getHeroes() {
		return this.heroesDB;
	}

	getHeroById(id) {
		return this.heroesDB.find(element => element.id === id);
	}

	addHero(hero) {
		if(!this.getHeroById(hero.id))
		{
			this.heroesDB.push(hero);
		}
	}

	updateHeroName(hero)
	{
		this.heroesDB.forEach(function(element)
		{
			if(element.id === hero.id)
			{
				element.name = hero.name;
				return;
			}
		});
	};

	deleteHeroById(id)
	{
		this.heroesDB = this.heroesDB.filter(element => element.id !== id);
	};

	length()
	{
		return this.heroesDB.length;
	};
}

module.exports = {Heroes};