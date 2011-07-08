var dbMan = require('./dbManager');
var fs = require('fs');
var request = require('request');
var sys = require('sys');
var settings = require('./settings');
var notificationManager = require('./notificationManager');
var timerID;
var scraper = {};
scraper.scrapeMore = false;
scraper.ircClient = {};

//Scrapes a single url from the db that has not been scraped before.
var scrapeURL = function(){
    dbMan.scrapesModel.findOne({'checked':false},function(err,scrape){
        try{
            if(scrape){
                console.log('[+] Starting scrape for :'+scrape.url);
                var fileName = scrape.url;
                request({ uri:'http://pastebin.com/raw.php?i='+fileName }, function (error, response, body) {
                    if (error && response.statusCode !== 200) {
                      console.log(error);
                      if(scraper.scrapeMore){
                          delayedScraper(scraper.scrapeMore,scraper.ircClient);
                      };
                    }
                    scrape.checked = true;
                    scrape.fileData = body;
                    notificationManager.dataChecker(body,'http://pastebin.com/'+scrape.url,scraper.ircClient);
                    scrape.save(function(err){
                        if(err){
                            console.log(err);
                            if(scraper.scrapeMore){
                                delayedScraper(scraper.scrapeMore,scraper.ircClient);
                                return;
                            };
                            return;
                        };
                        console.log('[-] Scraping complete ');
                        if(scraper.scrapeMore){
                            console.log('[-] Starting next scrape in 30 seconds');
                            delayedScraper(scraper.scrapeMore,scraper.ircClient);
                            return;
                        }else{
                            //process.exit();
                        };
                    });
                    
                });
            };
      }catch(supererr){
            console.log(supererr);
      }
    });
};

//starts a delayed scrape , by default after 30 seconds , will only scrape a single url
var delayedScraper = function(scrapeMultiple,ircClient){
    scraper.ircClient = ircClient;
    if(scrapeMultiple){
        scraper.scrapeMore = scrapeMultiple;
    };
    timerID = setTimeout(scrapeURL,settings.fileScanPause);
};

scraper.scrapeURL = scrapeURL;
scraper.delayedScraper = delayedScraper;

module.exports = scraper;
