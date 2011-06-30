var express = require('express');
var dbMan = require('./dbManager');
var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res){
    res.render('index', {
        title: 'Pasty Lurker'
    });
});
app.post('/', function(req, res){
    dbMan.scrapesModel.find({'fileData':new RegExp(req.body.searchdata)},function(err,docs){
        if(err){
           console.log(err);
           return;
        }
        res.render('results', {
            title: 'Search Results',
            locals:{ list: docs}
        });
    });
    
    //res.redirect('back');
});
app.listen(3000,'0.0.0.0');
console.log("Express server listening on port %d",app.address().port);
