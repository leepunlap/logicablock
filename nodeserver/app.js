var fs = require('fs');
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

var isHttps = true;
process.argv.forEach(function (val, index, array) {
  if (val === "development") {
    isHttps = false;
  }
});

if (isHttps) {
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/roadlogica.cn/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/roadlogica.cn/cert.pem')
  };
  var server = https.createServer(options,app);
} else {
  var server = http.createServer(app);
}

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
  socket.on('game', function(data){
    if (typeof(data.id) !== 'undefined') {
      for (var socketId in io.sockets.sockets) {
        if (data.id == socketId) {
          console.log(socket.id + ' game data for ' + socketId);
          io.emit('game',data);
        }
      }
    } else {
      console.log(socket.id + ' broadcast game data');
      io.emit('game',data);
    }
  });
  socket.on('gamemove', function(data){
    console.log(socket.id + ' game move');
    data.socketid = socket.id;
    io.emit('gamemove',data);
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
  if (isHttps) {
    console.log('API listening at https://%s:%s, static dir %s', host, port, __dirname + '/html');
  } else {
    console.log('API listening at http://%s:%s, static dir %s', host, port, __dirname + '/html');
  }
});

