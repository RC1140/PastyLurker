var scraper = require('scraper');
var dbMan = require('./dbManager');

scraper('http://pastebin.com/archive/', function(err, jQuery) {
    if (err) {throw err}

    jQuery('.g').each(function(index) {
            var title = jQuery(jQuery('td',this)[0]);
            var posted = jQuery(jQuery('td',this)[1]);
            var expires = jQuery(jQuery('td',this)[2]);
            var size = jQuery(jQuery('td',this)[3]);
            var syntax = jQuery(jQuery('td',this)[4]);
            var user = jQuery(jQuery('td',this)[5]);
            console.log('[+] Dumping '+index.toString());
            console.log('[-] Title : '+title.html());
            console.log('[-] Expires : '+expires.html());
            console.log('[-] Size : '+size.html());
            console.log('[-] Syntax : '+syntax.html());
            console.log('[-] User : '+user.html());    
            console.log('\n');    
            var scrapeURL =  title.attr('href').substring(1);
            var tinyUrl = title.attr('href').toString().substring(1);
            dbMan.scrapesModel.findOne({'url':scrapeURL},function(err,foundURL){
                if(!foundURL){
                    var scrapeMetaInfo = new dbMan.scrapesMetaModel();
                    scrapeMetaInfo.title    = title.text();
                    scrapeMetaInfo.expires  = expires.text();
                    scrapeMetaInfo.size     = size.text();
                    scrapeMetaInfo.syntax   = syntax.text();
                    scrapeMetaInfo.save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    var scrapeModel = new dbMan.scrapesModel();
                    scrapeModel.url = scrapeURL;
                    scrapeModel.checked = false;
                    scrapeModel.metaInfo = scrapeMetaInfo;
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
