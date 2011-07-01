//var argv = require('optimist')
            //.usage('Usage: --watchString=[consumer watchString] --username=[consumer username]')
            //.demand(['watchString']).argv;
var dbMan = require('./dbManager');

dbMan.scrapeWatchModel.find({},function(err,docs){
     docs.forEach(function(doc){
        doc.active = true;    
        doc.save(function(err){
           console.log('saved'); 
            });
     });        
});
//var watchModel = new dbMan.scrapeWatchModel();
//watchModel.watchString = argv.watchString;
//watchModel.active = true;
//dbMan.webUsersModel.findOne({'username':argv.username},function(err,user){
    //if(err){
        //console.log(err);
        //process.exit();
    //};
    //if(user){
        //watchModel.user.push(user);
        //watchModel.save(function(err){
            //if(err){
                //console.log(err);
            //}
            //console.log('watch saved');
            //process.exit();
        //});
    //}else{
        //console.log('no user found');
        //process.exit();
    //};
           
//});

