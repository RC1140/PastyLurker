var scraper = require('scraper');
var dbMan = require('./dbManager');
var loader = require('./fileScraper');
var urlScraper = {};

urlScraper.continuousScrape = false;

var scrapeArchive = function(continuosScrape){
    if(continuousScrape){
        urlScraper.continuousScrape = continuousScrape; 
    };
    scraper('http://pastebin.com/archive/', function(err, jQuery) {
        if (err) {throw err}
        jQuery('.g').each(function(index) {
            scrapeUrl(jQuery,this);
        });
        console.log('scraping complete');
    });
    if(url.continuousScrape){
        setTimeout(scrapeArchive,60000);
    };
};

var scrapeUrl = function(jQuery,rowFragment){
    var title = jQuery(jQuery('td',rowFragment)[0]);
    var posted = jQuery(jQuery('td',rowFragment)[1]);
    var expires = jQuery(jQuery('td',rowFragment)[2]);
    var size = jQuery(jQuery('td',rowFragment)[3]);
    var syntax = jQuery(jQuery('td',rowFragment)[4]);
    var user = jQuery(jQuery('td',rowFragment)[5]);
    var scrapeURL =  jQuery('a',title).attr('href').substring(1);
    
    console.log('[-] Title : '+title.html());
    console.log('[-] Expires : '+expires.html());
    console.log('[-] Size : '+size.html());
    console.log('[-] Syntax : '+syntax.html());
    console.log('[-] User : '+user.html());    

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
