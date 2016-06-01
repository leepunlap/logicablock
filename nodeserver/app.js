var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var io = require('socket.io')(server);

var getPlayers = function() {
    var players = []
    for (var socketId in io.sockets.sockets) {
        var player = io.sockets.sockets[socketId]['userdata']
        if (player.mode == 'student') {
            players.push ({
                id:socketId,
                userdata:player
            });
        }
    }
    return players;
}

io.on('connection', function(socket){
    console.log(socket.id + ' connected');
    socket['userdata']={group:"perdoco","username":"guest"};

    socket.on('remote', function(data){
        io.emit('remote',data);
    });
    socket.on('register', function(data){
        console.log(data);
        socket['userdata']=data;
        io.emit('groupmembership',getPlayers());
    });
    socket.on('disconnect', function(data){
        console.log(socket.id + ' disconnected');
        io.emit('groupmembership',getPlayers());
    });
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


app.get('/api/getplayers', function (req, res) {
    res.send(JSON.stringify(getPlayers()));
});

app.use(express.static(__dirname + '/rc/'));

server.listen(3001, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('API listening at http://%s:%s, static dir %s', host, port, __dirname + '/html');
});

