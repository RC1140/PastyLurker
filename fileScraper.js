var dbMan = require('./dbManager');
var fs = require('fs');
var request = require('request');
var sys = require('sys');
var settings = require('./settings');
var twitter = require('twitter');
var notifo = require('node-notifo');
var myNotifo = new notifo(settings.notifoUser,settings.notifoKey);

var timerID;
var scrapeMore = false;
var twit = new twitter({
    consumer_key: settings.twitter.consumer_key,
    consumer_secret: settings.twitter.consumer_secret,
    access_token_key: settings.twitter.access_token_key,
    access_token_secret: settings.twitter.access_token_secret
});

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
                dataChecker(body,'http://pastebin.com/'+scrape.url);
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
                        console.log('[-] Starting next scrape in 30 seconds');
                        delayedScraper();
                        return;
                    }else{
                        //process.exit();
                    };
                });
                
            });
            
            
        };
    });
};

var dataChecker = function(data,url){
    dbMan.scrapeWatchModel.find({},function(err,watches){
        if(watches){
            watches.forEach(function(watch){
                 var re = new RegExp(watch.watchString,'gi'); 
                 if(data.match(re)){
                      if(watch.notifoUserName){
                          myNotifo.sendNotification({ to: watch.notifoUserName, msg: 'Hey this url '+url+' matches your watch '+watch.watchString });
                      };
                      console.log('match found'); 
                 };
            });
        };        
    });
};

//starts a delayed scrape , by default after 30 seconds , will only scrape a single url
var delayedScraper = function(scrapeMultiple,ircClient){
    if(scrapeMultiple){
        scrapeMore = scrapeMultiple;
    };
    timerID = setTimeout(scrapeURL,30000);
};

var scraper = {};
scraper.scrapeURL = scrapeURL;
scraper.delayedScraper = delayedScraper;

module.exports = scraper;
