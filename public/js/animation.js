function processAnimations() {

	// Every 6th tick, switch to next sprite for current animation
	app.tick++;
	if(app.tick % 6 == 0 && app.player.name != "idle") {
		playerAnim.index++;
	} else if (app.tick % 10 == 0 && app.player.anim.name == "idle") {
		// Assume non-blinking state - but blink every so often on a random interval
		app.player.anim.index = 0;
		if (rand(0,15) > 14) {
			app.player.anim.index=1;
		}
	}

	// If reached the end of the animation length, start from zero
	if(app.player.anim.index >= app.player.anim[app.player.anim.name].length) {
		app.player.anim.index = 0;
	}

	// Animate workers
	for(var i in app.workers) {
		// Make them on different phases of animation
		if(app.tick % 6 == 0) {
			app.workers[i].anim.index++;
		}

		// If reached the end of the animation length, start from zero
		if(app.workers[i].anim_index >= app.player.anim[app.workers[i].anim.name].length) {
			app.workers[i].anim.index = 0;
		} 
	}


	// Add more information to terminal window as needed (when in correct mode)
	if (app.show_terminal && !app.panic_mode && (app.tick % (50 - player.hits*5) == 0)) {
	
		// Get a new random domain name
		var domain_index = Math.floor(rand(0, app.domain_names.length-1));
		var domain = app.domain_names[domain_index];
	
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
		
		app.terminal_listing.unshift(ip_record);
		//console.log( domain_index, domain, terminal_listing[0])
		if (app.terminal_listing.length > config.MAX_TERMINAL_LISTING) {
			app.terminal_listing.pop()
		}	

		$("#terminal_window > table > tbody:last").append(app.terminal_listing[0].log_entry);
		$("#terminal_window").scrollTop($("#terminal_window")[0].scrollHeight);

	}

	if (app.panic_mode && app.tick % 10 ) {
		// Generate particle "steam"
		var effect = new ParticleEffect();
		effect.x = app.player.x + app.player.width/2;		// Default
		effect.y = Math.round(app.ground - app.player.height*0.75);
		effect.max = 4;
		effects.push(effect);
	}
}
