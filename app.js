var scraper = require('scraper');
var dbMan = require('./dbManager');

scraper('http://pastebin.com/archive/', function(err, jQuery) {
        if (err) {throw err}

        jQuery('.g').each(function() {
                var scrapeURL = 'http://pastebin.com' + jQuery('a',jQuery('td',this)).attr('href');
                var scrapeModel = new dbMan.scrapesModel();
                scrapeModel.url = scrapeURL;
                scrapeModel.checked = false;
                scrapeModel.save(function(err){
                   if(err){
                       console.log(err);
                   } 
                    });
            });
        });
