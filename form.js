var MongoStore = require('connect-mongo');
var express = require('express');
var settings = require('./settings');
var dbMan = require('./dbManager');
var app = module.exports = express.createServer();
var bcrypt = require('bcrypt');  
var salt = bcrypt.gen_salt_sync(10);  

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
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

app.get('/login', function(req, res){
    res.render('login', {
        title: 'Please login below'
    });
});

app.get('/stats', function(req, res){
    dbMan.scrapesModel.find({}).count(function(err1,count){
        dbMan.scrapesModel.find({'checked':true}).count(function(err,countdeep){
            res.render('stats', {
                    title: 'Current App Stats',
                    scraped : countdeep ,
                    urls: count,
                    diff : count - countdeep 
            });        
        });        
    });
});


app.post('/login', function(req, res){
    if(req.body.username){
        dbMan.webUsersModel.findOne({'username':req.body.username},function(err,currentUser){
            if(err){
                console.log(err); 
                return;
            };
            req.session.authed = bcrypt.compare_sync(req.body.password, currentUser.password); 
            req.session.username = req.body.username; 
            res.redirect('/');    
            return;
        });
    }else{
        res.render('login', {
            title: 'Please login below'
        });
    };
});

app.get('/', function(req, res){
    if(req.session.authed){
        res.render('index', {
            title: 'Welcome to Pasty Lurker'
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

app.listen(3000,'127.0.0.1');
console.log("Express server listening on port %d",app.address().port);
