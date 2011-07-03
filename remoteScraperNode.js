var dnode = require('dnode');
var events = require('events');
var request = require('request');

module.exports = tinyScraper;

function tinyScraper(){
        events.EventEmitter.call(this);
};

tinyScraper.super_ = events.EventEmitter;
tinyScraper.prototype = Object.create(events.EventEmitter.prototype,{
    constructor : {
        value : tinyScraper,
        enumerable : false
    } 
});

tinyScraper.prototype.startScrape= function(){
    var self = this;
    self.startScrape = scrapeURL;
    dnode.connect(5050, function (remote) {
            remote.update('test');
            callback();
    });

    self.startScrape('',function(){
        self.emit('doneWithCall');        
    });
    return self;
};

var makeTestCall = function(callback){
    dnode.connect(5050, function (remote) {
            remote.update('test');
            callback();
    });
};

var scrapeURL = function(url,callback){
    request({ uri:url}, function (error, response, body) {
        if (error && response.statusCode !== 200) {
             callback(error);
        }else{
             callback(null,body);
        };
    });
};
