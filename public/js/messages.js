// Scripts for dealing with message passing to and from the server

var socket = io();

socket.on('status', function (data) {
	console.log(data);  
	socket.emit('status_update', { status: 'New player connected' });
});
  
// Handle status updates from other players
socket.on('status_update', function (data) {
	console.log(data);
	//otherPlayers[data.player_id] = data.player_status;
});  
  
  
function send_player_status_to_server(s) {
	console.log(s);	
	socket.emit('status_update', { status: JSON.stringify(s) });
}  
  