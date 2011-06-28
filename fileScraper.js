var dbMan = require('./dbManager');
var fs = require('fs');
var request = require('request');
var sys = require('sys');

var timerID;
var scrapeMore = false;

//Scrapes a single url from the db that has not been scraped before.
var scrapeURL = function(){
    dbMan.scrapesModel.findOne({'checked':false},function(err,scrape){
        console.log('[+] Starting scrape for :'+scrape.url);
        if(scrape){
            var fileName = scrape.url;
            request({ uri:'http://pastebin.com/raw.php?i='+fileName }, function (error, response, body) {
                if (error && response.statusCode !== 200) {
                  console.log(error);
                  if(scrapeMore){
                      delayedScraper();
                  };
                }
                scrape.checked = true;
                scrape.fileData = body;
                scrape.save(function(err){
                    if(err){
                        console.log(err);
                        if(scrapeMore){
                            delayedScraper();
                            return;
                        };
                        return;
                    };
                    console.log('[-] Scraping complete ');
                    if(scrapeMore){
                        delayedScraper();
                        return;
                    }else{
                        process.exit();
                    };
                });
                
            });
            
            
        };
    });
};

//starts a delayed scrape , by default after 30 seconds , will only scrape a single url
var delayedScraper = function(scrapeMultiple){
    if(scrapeMultiple){
        scapeMore = scrapeMultiple;
    };
    timerID = setTimeout(scrapeURL,30000);
};

var scraper = {};
scraper.scrapeURL = scrapeURL;
scraper.delayedScraper = delayedScraper;
//scraper.stopScraper = stopScraper;

module.exports = scraper;
