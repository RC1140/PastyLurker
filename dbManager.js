var mongoose = require('mongoose');
var config = require('./settings');

var dbManager = {}

var initCon = function(){
    db = mongoose.connect(config.mongoserver);
    mongoose.connection.on('open',function(){
            console.log('DB Connection Opened !!!');
    });
}();

var Schema = mongoose.Schema;

var scrapes = new Schema({
      url : String,
      checked : Boolean
});

var scrapesBase = mongoose.model('scrapes',scrapes);
var scrapesModel = mongoose.model('scrapes');

//dbManager.scrapesBase = scrapesBase;
dbManager.scrapesModel = scrapesModel;

module.exports = dbManager;
