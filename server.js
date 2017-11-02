var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
//var io = require('socket.io')(http);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

var heroes = [
	{ id: 0,  name: 'Zero' },
	{ id: 2, name: 'Mr. Nice' },
	{ id: 3, name: 'Narco' },
	{ id: 4, name: 'Bombasto' },
	{ id: 5, name: 'Celeritas' },
	{ id: 6, name: 'Magneta' },
	{ id: 7, name: 'RubberMan' },
	{ id: 8, name: 'Dynama' },
	{ id: 9, name: 'Dr IQ' },
	{ id: 10, name: 'Magma' },
	{ id: 11, name: 'Tornado' }
];


app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/view/index.html');
});

app.route('/heroes')
	.get( function (req, res)
	{
		res.send(heroes);
	})
	.post( function (req, res)
	{
		var name = req.body.name;
		var id =  req.body.id;
		var searchHero = heroes.find(element => element.id == req.body.id);

		if(id == null)
		{
			res.send("please send id parameter");
		}
		else if(searchHero == null) {

			var newHero = {id: id, name: name};
			heroes.push(newHero);
			res.send(heroes);
		}
		else
		{
			res.send("there is hero with this id");
		}
	})
	.delete ( function (req, res)
	{
		var id =  req.query.id;
		var heroesCount = heroes.length;

		if(id== null)
		{
			res.send("please send id parameter");
		}
		else
		{
			heroes = heroes.filter(element => element.id != id);

			if(heroesCount == heroes.length)
			{
				res.send("there is not hero with same id");
			}
			else
			{
				res.send(heroes);
			}
		}
	});

app.route('/heroes/:id')
	.get( function (req, res)
	{
		var hero = heroes.find(element => element.id == req.params.id);

		if(hero != null)
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
		heroes = heroes.filter(element => element.id != req.params.id);
		res.send(heroes);
	})
	.put( function (req, res)
	{
		var name = req.query.name;
		heroes.forEach(function(element)
		{
			if(element.id == req.params.id)
			{
				element.name = name;
				return;
			}
		});

		res.send(heroes);

	});




http.listen(3000, function(){
	console.log('listening on *:3000');
});