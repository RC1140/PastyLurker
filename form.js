var MongoStore = require('connect-mongo');
var express = require('express');
var settings = require('./settings');
var dbMan = require('./dbManager');
var app = module.exports = express.createServer();

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ store: MongoStore({url:settings.mongostore.server}), secret: settings.mongostore.secret }));
    app.use(express.methodOverride());
    app.dynamicHelpers({
        session: function (req, res) {
            return req.session;
        }
    });
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.post('/login', function(req, res){
    if(req.body.username){
        req.session.authed = true; 
        req.session.username = req.body.username; 
        res.redirect('/');
        return;
    }else{
        res.render('login', {
            title: 'Pasty Lurker'
        });
    };
});

app.get('/', function(req, res){
    if(req.session.authed){
        res.render('index', {
            title: 'Pasty Lurker'
        });
    }else{
        res.redirect('/login'); 
    };
});

app.post('/', function(req, res){
    dbMan.scrapesModel.find({'fileData':new RegExp(req.body.searchdata,"gi")},function(err,docs){
        if(err){
           return;
        }
        res.render('results', {
            title: 'Search Results',
            locals:{ list: docs}
        });
    });
    
});

app.get('/login', function(req, res){
    res.render('login', {
        title: 'Pasty Lurker'
    });
});


app.listen(3000,'127.0.0.1');
console.log("Express server listening on port %d",app.address().port);
