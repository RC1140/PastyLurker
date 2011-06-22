var scraper = require('scraper');
var dbMan = require('./dbManager');

scraper('http://pastebin.com/archive/', function(err, jQuery) {
        if (err) {throw err}

        jQuery('.g').each(function() {
                var scrapeURL = 'http://pastebin.com' + jQuery('a',jQuery('td',this)).attr('href');
                var scrapeModel = new dbMan.scrapesModel();
	        dbMan.scrapesModel.findOne({'url':scrapeURL},function(err,foundURL){
			if(!foundURL){
				console.log('scraping : '+scrapeURL);
				scrapeModel.url = scrapeURL;
				scrapeModel.checked = false;
				scrapeModel.save(function(err){
				   if(err){
				       console.log(err);
				   }else{
				       console.log('saved: '+scrapeURL);
				   } 
				});
			}else{
			        console.log(foundURL);
			}
			
            });
        });
});
