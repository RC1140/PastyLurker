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
      watchString : String,
      email : String,
      notifoUserName : String,
      ircHandle : String,
      twitterHandle: String
});

var webUsers = new Schema({
      username : String,
      password : String
});

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
