//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));



router.get("/t/:ticker/a/:algorithm_id", function(req, res, next){
    //console.log(req.query.id);
    console.log(req.params.ticker);
    var options = {}
    options.ticker = req.params.ticker;
    options.algorithm_id = req.params.algorithm_id;
    var heWentToJared = require('./app/controllers/heWentToJared.js');
    // now we run calculate and make the callback function send the response
    heWentToJared(options, function(calculatedJSON){
        res.json(calculatedJSON);
    })
    // var obj = JSON.parse(fs.readFileSync('./client/dearLordWork.json', 'utf8'));
    // res.json(obj)
});

// var financial = require('./app/controllers/financial.js');
// financial(function(body){
//   console.log(body);
// })



var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
