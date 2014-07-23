function processAnimations() {

	// Every 6th tick, switch to next sprite for current animation
	tick++;
	if(tick % 6 == 0 && playerAnim.name != "idle") {
		playerAnim.index++;
	} else if (tick % 10 == 0 && playerAnim.name == "idle") {
		// Assume non-blinking state - but blink every so often on a random interval
		playerAnim.index = 0;
		if (rand(0,15) > 14) {
			playerAnim.index=1;
		}
	}

	// If reached the end of the animation length, start from zero
	if(playerAnim.index >= playerAnim[playerAnim.name].length) {
		playerAnim.index = 0;
	}

	// Animate workers
	for(var i in workers) {
		// Make them on different phases of animation
		if(tick % 6 == 0) {
			workers[i].anim_index++;
		}

		// If reached the end of the animation length, start from zero
		if(workers[i].anim_index >= playerAnim[workers[i].anim_name].length) {
			workers[i].anim_index = 0;
		} 
	}


	// Add more information to terminal window as needed (when in correct mode)
	if (show_terminal && !panic_mode && (tick % (50 - hits*5) == 0)) {
	
		// Get a new random domain name
		var domain_index = Math.floor(rand(0, domain_names.length-1));
		var domain = domain_names[domain_index];
	
		var ip = Math.floor(rand(0,255)) + "." + Math.floor(rand(0,255)) + "." + Math.floor(rand(0,255)) + "." + Math.floor(rand(0,255));
		var d=new Date();
		var datestamp = ('0' + d.getMonth()).slice(-2) + "/" + ('0' + d.getDate()).slice(-2) + "/" + d.getFullYear() + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
		
		// Randomly select an IP to highlight
		// Assume not a highlighted record
		var color = "green"
		var target_record = false;
		
		if (rand(0,5) > 4) {
			color = "red"
			target_record = true;
		}	
				
		var ip_record = {
			ip_address: ip,
			log_entry: "<tr style='color:" + color + ";'><td style='width:170px;text-align:left;'>" + ip + "</td><td style='width:240px;text-align:left;'>[" + datestamp + "]</td><td style='width:375px;text-align:left;'>\"GET\" " + domain + " HTTP/1.0\"</td>",
			hit: target_record
		}
		
		terminal_listing.unshift(ip_record);
		//console.log( domain_index, domain, terminal_listing[0])
		if (terminal_listing.length > MAX_TERMINAL_LISTING) {
			terminal_listing.pop()
		}	

		$("#terminal_window > table > tbody:last").append(terminal_listing[0].log_entry);
		$("#terminal_window").scrollTop($("#terminal_window")[0].scrollHeight);

	}

	if (panic_mode && tick % 10 ) {
		// Generate particle "steam"
		var effect = new ParticleEffect();
		effect.x = player.x + player.w/2;		// Default
		effect.y = Math.round(ground-player.h*0.75);
		effect.max = 4;
		effects.push(effect);
	}
}
