var settings = require('./settings');
var dbMan = require('./dbManager');
var loader = require('./fileScraper');
var request = require('request');
var urlScraper = {};
var $ = require('jquery');

urlScraper.continuousScrape = false;

var scrapeArchive = function(continuousScrape,ircClient){
    if(continuousScrape){
        urlScraper.continuousScrape = continuousScrape; 
    };
    request({ uri:'http://pastebin.com/archive' }, function (error, response, body) {
        if (error && response.statusCode !== 200) {
          console.log(error);
        }
        $('.g',body).each(function(index) {
            scrapeUrl($,this);
        });
        console.log('scraping complete');
        if(urlScraper.continuousScrape){
            setTimeout(scrapeArchive,settings.urlScanPause);
        };
    });
};

var scrapeUrl = function(jQuery,rowFragment){
    var title = jQuery(jQuery('td',rowFragment)[0]);
    var posted = jQuery(jQuery('td',rowFragment)[1]);
    var expires = jQuery(jQuery('td',rowFragment)[2]);
    var size = jQuery(jQuery('td',rowFragment)[3]);
    var syntax = jQuery(jQuery('td',rowFragment)[4]);
    var user = jQuery(jQuery('td',rowFragment)[5]);
    var scrapeURL =  jQuery('a',title).attr('href').substring(1);
    
    //console.log('[-] Title : '+title.html());
    //console.log('[-] Expires : '+expires.html());
    //console.log('[-] Size : '+size.html());
    //console.log('[-] Syntax : '+syntax.html());
    //console.log('[-] User : '+user.html());    

    var scrapeMetaInfo = new dbMan.scrapesMetaModel();
    scrapeMetaInfo.title    = title.text();
    scrapeMetaInfo.expires  = expires.text();
    scrapeMetaInfo.size     = size.text();
    scrapeMetaInfo.syntax   = syntax.text();
    
    var scrapeModel = new dbMan.scrapesModel();
    scrapeModel.url = scrapeURL;
    scrapeModel.checked = false;
    scrapeModel.metaInfo = scrapeMetaInfo;
    scrapeModel.save(function(err){
       if(err){
           //console.log(err);
           return;
       }; 
       //console.log('document saved');
    });
};

urlScraper.scrapeArchive = scrapeArchive;
module.exports = urlScraper;
