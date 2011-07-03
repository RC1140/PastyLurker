var tester = require('./test')
var tmp = new tester();
tmp.testCall()
tmp.on('doneWithCall',function(){
        console.log('call complete');
        });

