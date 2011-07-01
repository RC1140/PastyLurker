var argv = require('optimist')
            .usage('Usage: --password=[consumer password]')
            .demand(['password']).argv;
var dbMan = require('./dbManager');
var bcrypt = require('bcrypt');

var salt = bcrypt.gen_salt_sync(10);  
var hash = bcrypt.encrypt_sync(argv.password.toString(), salt);

var user = new dbMan.webUsersModel();
user.username = 'jameel';
user.password = hash;
user.save(function(err){
     if(err){
        console.log(err); 
     } 
});
