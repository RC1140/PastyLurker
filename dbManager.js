var mongoose = require('mongoose');
var config = require('./settings');

var dbManager = {}

var initCon = function(){
console.log(config.mongoserver);
    db = mongoose.connect(config.mongoserver);
    mongoose.connection.on('open',function(){
            console.log('DB Connection Opened !!!');
    });
}();

var Schema = mongoose.Schema;

var scrapeMetaInfo = new Schema({
      title     : String,
      expires   : String,
      size      : String,
      syntax    : String,
      user      : String
});


var scrapes = new Schema({
      url       : {type:String, index: {unique: true}},
      fileData  : String,
      checked   : Boolean,
      metaInfo  : [scrapeMetaInfo],
      captureDate: { type: Date, default: Date.now }
});

var scrapeWatch = new Schema({
      watchString       : String,
      active            : Boolean,
      user              : [webUsers]
});

var webUsers = new Schema({
      username          : String,
      password          : String,
      email             : String,
      notifoUserName    : String,
      ircHandle         : String,
      twitterHandle     : String
});

var appSettings = new Schema({
      notifoUser                : String,
      notifoKey                 : String,
      twitter_consumer_key      : String,
      twitter_consumer_secret   : String,
      twitter_access_token_key  : String,
      twitter_access_token_secret: String,
      IRC_channel               : String,
      IRC_server                : String,
      IRC_nick                  : String,
      IRC_realName              : String,
      IRC_userName              : String
});

config.urlScanPause = 120000;
config.fileScanPause = 10000;

config.IRC.realName = '#zacon bot that captures urls';
config.IRC.userName = 'Kiba Inuzuka';



mongoose.model('scrapes',scrapes);
mongoose.model('scrapesMeta',scrapeMetaInfo );
mongoose.model('scrapeWatch',scrapeWatch);
mongoose.model('webUsers',webUsers);

var scrapesModel = mongoose.model('scrapes');
var scrapesMetaInfoModel = mongoose.model('scrapesMeta');
var scrapeWatchModel = mongoose.model('scrapeWatch');
var webUsersModel = mongoose.model('webUsers');

dbManager.scrapesModel = scrapesModel;
dbManager.scrapesMetaModel = scrapesMetaInfoModel;
dbManager.scrapeWatchModel = scrapeWatchModel;
dbManager.webUsersModel = webUsersModel;

module.exports = dbManager;
