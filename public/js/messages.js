// Scripts for dealing with message passing to and from the server

 var socket = io();
 
  socket.on('status', function (data) {
    console.log(data);
    
    socket.emit('status_update', { status: 'new status' });
  });