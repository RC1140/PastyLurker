var dbMan = require('./dbManager');
var twitter = require('twitter');
var settings = require('./settings');
var notifo = require('node-notifo');
var myNotifo = new notifo(settings.notifoUser,settings.notifoKey);

var twit = new twitter({
    consumer_key: settings.twitter.consumer_key,
    consumer_secret: settings.twitter.consumer_secret,
    access_token_key: settings.twitter.access_token_key,
    access_token_secret: settings.twitter.access_token_secret
});


var dataChecker = function(data,url,ircClient){
    dbMan.scrapeWatchModel.find({'active':true},function(err,watches){
        if(watches){
            watches.forEach(function(watch){
                 var re = new RegExp(watch.watchString,'gi'); 
                 if(data.match(re)){
                      console.log('matching');
                      notifoUpdate(watch,url);                      
                      ircUpdate(watch,url,ircClient);                      
                      twitterUpdate(watch,url);
                 };
            });
        };        
    });
};

//Run a notifo update for a watch
var notifoUpdate = function(watch,url){ 
    //Loop through all the users that may have registered for this watch
    for(var i=0;i<watch.user.length;i++){
        //If we have a username then use it
        if(watch.user[i].notifoUserName){
              myNotifo.sendNotification({ to: watch.user[i].notifoUserName, msg: 'Hey this url '+url+' matches your watch '+watch.watchString });
        };
    };
};

//Run a irc update for a watch
var ircUpdate = function(watch,url,ircClient){ 
    //Loop through all the users that may have registered for this watch
    for(var i=0;i<watch.user.length;i++){
        //If we have a username then use it
        if(watch.user[i].ircHandle){
             if(ircClient){
                 ircClient.say(watch.user[i].ircHandle, 'Hey this url '+url+' matches your watch '+watch.watchString );
             };
        };
    };
};

var twitterUpdate = function(watch,url){
    for(var i=0;i<watch.user.length;i++){
        if(watch.user[i].twitterHandle){
            twit.verifyCredentials(function (data) {
                //sys.puts(sys.inspect(data)); //Use this for debugging
            }).updateStatus('@'+watch.user[i].twitterHandle+' a url matching your watch '+watch.watchString+' was found @ '+url,function (data) {
                //sys.puts(sys.inspect(data)); //Use this for debugging
            });
        };
    };
    
};

module.exports.dataChecker = dataChecker;
