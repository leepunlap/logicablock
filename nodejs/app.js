var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/rc/'));

// app.get('/', function (req, res) {
//     res.sendfile(__dirname + '/rc/index.html');
// });

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('msg', function(data){
        console.log('msg : ' + data);
    });

    socket.emit("msg",{he:'is'})


});



http.listen(3001, function(){
    console.log('listening on *:3001');
});