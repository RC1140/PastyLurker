var dbMan = require('./dbManager');

var watchModel = new dbMan.scrapeWatchModel();
watchModel.watchString = 'error'
watchModel.save(function(err){
        if(err){
           console.log(err);
       }
       process.exit();
});

