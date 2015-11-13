
var simpleTwitter = require('simple-twitter');
var fs = require('fs');
var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('RSS Twitter Bot\n');
}).listen(5693);

var timeInterval = 30000; // run every 10m
var timerVar = setInterval (function () {runBot()}, timeInterval); 

function runBot(){
	var lastCompleted = Date.parse(new Date(0));
	console.log(lastCompleted);

	try {
		var lastcompletedData = fs.readFileSync('./lastCompleted.json', 'utf8');
		var timeData = JSON.parse(lastcompletedData);

		var lastCompletedFromFile = Date.parse(new Date(timeData.lastCompleted));
		if ( isNaN(lastCompletedFromFile) == false ) {
			lastCompleted = lastCompletedFromFile;
		}

	} catch (e) {
		console.log(e);
	}

	fs.readFile('./config.json', 'utf8', function (err, data) {
    	if (err) console.log(err); // we'll not consider error handling for now
    	var configData = JSON.parse(data);

		console.log(configData);
		
		var twitter = new simpleTwitter( configData.consumerKey //consumer key from twitter api
								 , configData.consumerSecret //consumer secret key from twitter api
								 , configData.accessToken //access token from twitter api 
								 , configData.accessTokenSecret //access token secret from twitter api 
								 , 3600); 

		var dateNow = Date.parse(new Date());
		var FeedParser = require('feedparser');
		var request = require('request');

		var req = request(configData.feedUrl);
		var feedparser = new FeedParser();

		req.on('error', function (error) {
			console.log(error);
		});

		req.on('response', function (res){
			var stream = this;

			if (res.statusCode != 200 ) return this.emit('error', new Error('Bad status code'));
			stream.pipe(feedparser);
		});

		feedparser.on('error', function(error) {  
		    console.log(error);
		});

		feedparser.on('readable', function() { 
			var stream = this;
			var meta = this.meta;

			var item;

			while (item = stream.read()) {
				var itemDate = Date.parse(item.date);

				//check to not publish older articles
				if (itemDate > lastCompleted){
					var titleLength = item.title.length;
					var itemTitle = item.title;

					if (titleLength > 100) {
						itemTitle = itemTitle.substring(0, 100);
					}

					twitter.post('statuses/update'
			                    , {'status' : itemTitle + ' ' + item.link + configData.tags}
			                    , function (error, data) {
			                        console.dir(data);
			                    });
					
					console.log(itemTitle + ' ' + item.link + configData.tags);
				}
			}

			//TO KNOW WHEN FROM TO START POSTING
			var dateCompleted = new Date();
			console.log('loop completed at ' + dateCompleted);

			var outputData = {
			  lastCompleted : dateCompleted
			}

			var outputFilename = './lastCompleted.json';

			fs.writeFile(outputFilename, JSON.stringify(outputData, null, 4), function(err) {
			    if(err) {
			      console.log(err);
			    } else {
			      console.log("JSON saved to " + outputFilename);
			    }
			}); 
		});
	});
}
