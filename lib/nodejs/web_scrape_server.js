/**
 * Node Web Scrape Server
 *
 * Accepts JSON GET: {fn: 'scrape_title', url: 'http://www.something.com'}
 * Returns JSON: { title: 'Page Title' }
 */

var http = require('http');
var request = require('request');
var url = require('url');
var queryString = require( "querystring" );
var cheerio = require('cheerio');

var port = 8081;

s = http.createServer(function (req, res) {

	console.log("createServer called");
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	console.log(query);
	if(query.fn == 'scrape_title') {
		request({uri: query.url}, function(error, response, body){

			console.log("request called");

			var dom = cheerio.load(body);
			var title = dom('title');
			var json_res = { title: title.html() };
			res.end(JSON.stringify(json_res));
		})
	} else {
		var json_res = { title: 'Bollocks' };
		res.end(JSON.stringify(json_res));
	}

});

s.listen(port, '127.0.0.1');


console.log('Server running at http://127.0.0.1:'+port+'/');