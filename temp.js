var scraper = require('scraper');
var dbMan = require('./dbManager');

scraper('http://localhost/~jameelhaffejee/archive.html', function(err, jQuery) {
        if (err) {throw err}

        var test = jQuery('.g').each(function(index){
            console.log('[+] Dumping '+index.toString());
            var title = jQuery(jQuery('td',this)[0]).html();
            var posted = jQuery(jQuery('td',this)[1]).html();
            var expires = jQuery(jQuery('td',this)[2]).html();
            var size = jQuery(jQuery('td',this)[3]).html();
            var syntax = jQuery(jQuery('td',this)[4]).html();
            var user = jQuery(jQuery('td',this)[5]).html();
            console.log(title);
            console.log(posted);
            console.log(expires);
            console.log(size);
            console.log(syntax);
            console.log(user);    
            console.log('\n');    
            });
        
});
