var dbMan = require('./dbManager');
var fs = require('fs');
var request = require('request'),
    sys = require('sys');

dbMan.scrapesModel.find({'checked':false},function(err,scrapes){
	scrapes.forEach(function(scrape){
	if(scrape){
		var tmpFile = scrape.url.split('/');
		var fileName =tmpFile[tmpFile.length-1];
		request({ uri:'http://pastebin.com/raw.php?i='+fileName }, function (error, response, body) {
		  if (error && response.statusCode !== 200) {
		    console.log('Error when contacting google.com')
		  }
		fs.writeFile('./logs/'+fileName, body, function(err) {
		    if(err) {
			sys.puts(err);
		    } else {
			sys.puts("The file was saved!");
		    }
		}); 
		  // Print the google web page.
		});
	}});
});
