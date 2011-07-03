var dbMan = require('./dbManager')
var dnode = require('dnode');

var scrapeURL = function(){
    dbMan.scrapesModel.findOne({'checked':false},function(err,scrape){
        console.log('[+] Starting scrape for :'+scrape.url);
        if(scrape){
            var fileName = scrape.url;
            request({ uri:'http://pastebin.com/raw.php?i='+fileName }, function (error, response, body) {
                if (error && response.statusCode !== 200) {
                  console.log(error);
                  process.exit(); 
                }
                scrape.checked = true;
                scrape.fileData = body;
                if(body.indexOf('Hey, it seems you are requesting a little bit too much from Pastebin. Please slow down!' != -1){
                     process.exit();    
                };
                scrape.save(function(err){
                    if(err){
                        console.log(err);
                        process.exit(); 
                        return;
                    };
                    console.log('[-] Scraping complete ');
                    console.log('[-] Starting next scrape in 30 seconds');
                    setTimeout(scrapeURL,5000);
                    return;
                });
                
            });
        };
    });
};

dnode.connect(5050, function (remote) {
     scrapeURL();
});

