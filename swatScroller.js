var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');
app.listen(8080);

function handler (req, res) {
    req.addListener('end', function () {
        file.serve(req, res);
    }).resume();
}

io.on('connection', function (socket) {
  socket.emit('status', { message: 'Connected to the server' });
  
  socket.on('status_update', function (data) {
    console.log(data);
  });
});