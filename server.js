var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
//var io = require('socket.io')(http);

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

var heroesRec = require('./heroes');
var heroes = new heroesRec.Heroes();


app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/view/index.html');
});

app.route('/heroes')
	.get( function (req, res)
	{
		res.send(heroes.getHeroes());
	})
	.post( function (req, res)
	{
		const name = req.body.name;
		const id =  req.body.id;

		if(id === null)
		{
			res.send("please send id parameter");
		}
		else
		{
			const getHero = heroes.getHeroById(id);
			if(!getHero)
			{
				const newHero = {id: id, name: name};
				heroes.addHero(newHero);
				res.send(heroes);
			}
			else
			{
				res.send("there is hero with this id");
			}
		}

	})
	.delete ( function (req, res)
	{
		const id =  req.query.id;
		const heroesCount = heroes.length;

		if(id === null)
		{
			res.send("please send id parameter");
		}
		else
		{
			heroes.deleteHeroById(id);
			if(heroesCount === heroes.length)
			{
				res.send("there is not hero with same id");
			}
			else
			{
				res.send(heroes.getHeroes());
			}
		}
	});

app.route('/heroes/:id')
	.get( function (req, res)
	{
		const hero = heroes.getHeroById(req.params.id);

		if(hero)
		{
			res.send(hero);
		}
		else
		{
			res.send("hero not found");
		}
	})
	.delete( function (req, res)
	{

		const id =  req.params.id;
		const heroesCount = heroes.length;

		if(id === null)
		{
			res.send("please send id parameter");
		}
		else
		{
			heroes.deleteHeroById(id);
			if(heroesCount === heroes.length)
			{
				res.send("there is not hero with same id");
			}
			else
			{
				res.send(heroes.getHeroes());
			}
		}
	})
	.put( function (req, res)
	{
		const name = req.query.name;
		const id = req.params.id;

		if(id === null  || name === null)
		{
			res.send("please send id,name parameter");
		}
		else
		{
			heroes.updateHeroName(id,name);
			res.send(heroes.getHeroes());
		}
	});

const httpServer = http.listen(3000, function(){
	console.log('listening on *:3000');
});

module.exports = {
	httpServer:httpServer,
	setHeroes : (heroesObject)=>{
		heroes = heroesObject;
	}
}