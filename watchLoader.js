var dbMan = require('./dbManager');

var watchModel = new dbMan.scrapeWatchModel();
watchModel.watchString = 'lulzsec';
watchModel.notifoUserName = 'RC1140';
watchModel.twitterhandle  = 'RC1140';

watchModel.save(function(err){
        if(err){
           console.log(err);
       }
       process.exit();
});

//myNotifo.subscribeUser({ username: 'RC1140' });
//myNotifo.sendNotification({ to: 'RC1140', msg: 'Hey this url matches your watch' });
//myNotifo.sendMessage({ to: 'RC1140', msg: 'whatsup?!' });


//myNotifo.send({ to: 'RC1140', msg: 'New notification!' }, function(err, response) {
	//if (err) {
		//throw err
	//} else {
		//console.log(response);
	//}
//});
