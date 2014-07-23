function checkConditions() {

	if(player.intersects(filing_cabinet)) {
		if (player.x > filing_cabinet.x) {
			player.x = player.x + 8;
		}	else {
			player.x = player.x - 8;
		}
	
	}

	if(player.intersects(player_desk) && !panic_mode) {
		// if the terminal isn't locked, show the terminal
		if (!lock_computer) { 
			$("#player_input").focus();
		} else {
			$("#player_input").blur();		
			// Computer is locked - check to see if the player has unlocked the computer
			if(pressed[13] == true) {	// 27 = enter key
				lock_computer = false;
			}
		}
		
		// In any case, if the player is overlapping the desk, show the typing mode and the terminal
		playerAnim.name = "typing"
		show_terminal= true;   

	} else {
		show_terminal= false; 
		lock_computer = false;
		$("#player_input").blur();
	}

	// Decide if there is an emergency
	// Must be in the terminal.  Check every so often with a random chance of panic mode
	if (show_terminal &&  !panic_mode && (tick % 100 == 0) && rand(0,10)>9) {
		start_panic_mode()
	}


	// Check if worker has typed in incorrect password
	if (panic_mode) {
	
		// If too long has passed since the guilty worker started typing the password, make the player lose a life and some points
	 	if ( ((tick - workers[guilty_worker].start_guilt_tick) / 100) >= WORKER_PASSWORD_LENGTH) {
	 		hits = hits - 1;
	 		alert("You lost a life"); 	
	 		panic_mode = false;
	 	}

		// Otherwise, see if the player reached the worker in time
		if (player.intersects(workers[guilty_worker].location)) {
			panic_mode = false;
			workers[guilty_worker].guilty = false;
			//alert("You got there in time!  Crisis averted."); 
		}

	}




	// Make sure player doesn't go below the ground
    if(player.getBottom() > ground) {
        player.dy = 0;
        player.setBottom(ground);
    }

	// Clean up dead effects
	for (var i=0; i < effects.length; i++) {
		if (!effects[i].alive) {effects.splice(i, 1);}
	}
}



function check_terminal_input()
{
	test_input = $("#player_input").val();
	// Loop through the possible values, looking for a match
	for (var i in terminal_listing)
	{
		// Check to see if this listing is a hit -- if so, see if the IP matches the user input
		if (terminal_listing[i].hit && test_input == terminal_listing[i].ip_address) {
			hits++;
			$("#player_input").val("");		// Clear input
			return;
		}
	}
}