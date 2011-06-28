var urlScraper = require('./urlscraper');
var fileScraper = require('./fileScraper');
var dbMan = require('./dbManager');
var irc = require('irc');
var config = require('./settings');

var client = new irc.Client(config.IRC.server, config.IRC.nick, {
    userName : config.IRC.userName,
    realName : config.IRC.realName,
    autoRejoin : true,
    channels: [config.IRC.channel],
});

client.addListener('registered', function () {
});

client.addListener('pm', function (from, to, message) {
      if(message.indexOf('addwatch') == 0){
            var splitParams = message.split('');
            var watchType = splitParams[1];
            splitParams.splice(0.2);
            var watchString = splitParams.join(' ');
            var watchModel = new dbMan.scrapeWatchModel();
            watchModel.watchString = watchString;
            if(watchType =='irc'){
                watchModel.ircHandle = from;
            }else if(watchType =='notifo'){
                watchModel.notifoUserName = from;
            }else{
                client.say(from,'Invalid watch type , please use either irc or notifo');
                return;

            };
            watchModel.save(function(err){
                    if(err){
                       console.log(err);
                   }
                   process.exit();
            });
            client.say(from,'Your watch has been saved , when a paste matching your message is found you will be notified');
      }else if(message.indexOf('registernotifo') == 0){
            myNotifo.subscribeUser({ username: from });
            myNotifo.sendNotification({ to: from, msg: 'Hey this is just a welcome message' });
            client.say(from,'You have been registered and a test notification sent'); 
      }else if(message.indexOf('help') == 0){
            client.say(from,'The following commands are available.'); 
            client.say(from,'[+] addwatch (note your current irc handle will be used for irc and notifo messages)'); 
            client.say(from,'[-] e.g. addwatch irc lulzsec'); 
            client.say(from,'[-] e.g. addwatch notifo lulzsec'); 
            client.say(from,'[+] registernotifo'); 
            client.say(from,'[-] This command has no extra params , it uses your current irc handle to regiser you with notifo'); 
      }else{
            client.say(from,'No command found , please use either registernotifo or addwatch or help'); 
      };
});

//Startup continuous scraping of files and urls
urlScraper.scrapeArchive(true,client);
fileScraper.delayedScraper(true,client);
