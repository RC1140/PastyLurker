var argv = require('optimist')
            .usage('Usage: --watchString=[consumer watchString] --notifo=[consumer notifo] --irc=[consumer irc] --twitter=[consumer twitter]')
            .demand(['watchString']).argv;
var dbMan = require('./dbManager');

var watchModel = new dbMan.scrapeWatchModel();
watchModel.watchString = argv.watchString;
if(argv.notifo){
    watchModel.notifoUserName = argv.notifo;
}
if(argv.irc){
    watchModel.ircHandle = argv.irc;
}
if(argv.twitter){
    watchModel.twitterHandle = argv.twitter;
}
watchModel.save(function(err){
    if(err){
        console.log(err);
    }
    process.exit();
});
