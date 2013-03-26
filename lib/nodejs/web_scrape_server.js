/**
 * Node Web Scrape Server
 *
 * Accepts JSON GET: {fn: 'scrape_title', url: 'http://www.something.com'}
 * Returns JSON: { title: 'Page Title' }
 */

var http = require("http");
var url = require('url');

var port = 8081, redirect_count, max_redirects = 5;

s = http.createServer(function (req, res) {

	// Write response header
	res.writeHead(200, {'Content-Type': 'application/json'});

	// GET vars sent from client
	var req_vars = url.parse(req.url, true).query;

	if(req_vars.fn == 'scrape_title') {

		// Break down the URL from the query for http.request
		var req_url = url.parse(req_vars.url);

		// Lets scrape a title
		var opts = {
			method: 'GET',
			port: 80,
			hostname: req_url.hostname,
			path: req_url.path
		};
		redirect_count = 0;
		scrape(opts, res);

	} else {

		// Not scraping titles? Fuck off. Just fuck off.
		err(res, "unknown_fn");

	}
	
}).listen(port, '127.0.0.1');

function err(obj, msg) {
	obj.end(JSON.stringify({
		status: "error",
		message: msg
	}));
}

function scrape(opts, res){
	var scrape_req = http.request(opts, function(response) {
		var request = this;
		var str = '';

		if(response.statusCode == 200) {
			// When data comes in, add it to our buffer
			response.on('data', function (chunk) {
				str += chunk;

				// Abort request if response gets over over 5KB
				if(str.length > 5000) {
					request.abort();
					request.end();
				}
			});
			response.on('end', function() {

				// When we're done, Match a title element
				var title = str.match(/<title[^>]*>(.*?)<\/title>/);
				if(title) {
					res.end(JSON.stringify({
						status: "ok",
						title: title[1]
					}));
				} else {
					err(res, "Can't find title");
				}
			});

		// Follow redirects. Ref:
		// https://github.com/olalonde/follow-redirects/blob/master/index.js
		// Note: This module can't be used as it doesn't pass back request.abort()
		} else if (response.statusCode > 299 && response.statusCode < 399 && ('location' in response.headers) && redirect_count < max_redirects) {
			var req_url = url.parse(response.headers['location']);
			opts.hostname = req_url.hostname;
			opts.path = req_url.path;
			redirect_count++;
			scrape(opts, res);
		} else {
			err(res, response.statusCode);
		}
	});

	scrape_req.on('error', function(e) {
		err(res, e);
	})
	scrape_req.end();
	return scrape_req;
}
