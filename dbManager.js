var mongoose = require('mongoose');
var config = require('./settings');

var dbManager = {}

var initCon = function(){
console.log(config.mongoserver);
    db = mongoose.connect('mongodb://localhost/scrapie');
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

mongoose.model('scrapes',scrapes);
mongoose.model('scrapesMeta',scrapeMetaInfo );
var scrapesModel = mongoose.model('scrapes');
var scrapesMetaInfoModel = mongoose.model('scrapesMeta');

dbManager.scrapesModel = scrapesModel;
dbManager.scrapesMetaModel = scrapesMetaInfoModel;

module.exports = dbManager;
