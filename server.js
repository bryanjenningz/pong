var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
  console.log('A user connected');
});

http.listen(80, function() {
  console.log('Server listening on port ' + 80);
});
