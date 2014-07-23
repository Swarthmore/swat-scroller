// SwatScroller drawing routines



function Box(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fillRect = function(ctx) {
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	this.getRight = function() { return this.x + this.w; }
	this.getLeft = function() { return this.x; }
	this.getTop = function() { return this.y; }
	this.getBottom = function() { return this.y + this.h; }

	this.setRight  = function(right) { this.x = right - this.w; }
	this.setLeft   = function(left)  { this.x = left; }
	this.setBottom = function(bottom) { this.y = bottom - this.h; }
	this.setTop    = function(top) { this.y = top; }

	this.intersects = function(box) {
		if(this.getRight() >= box.getLeft() 
		&& this.getLeft() <= box.getRight()) {
			if(this.getBottom() >= box.getTop() 
			&& this.getTop() <= box.getBottom()) {
					return true;
			}
		}	
		return false;    	
	}
}

function rand(lo,hi) {
	return lo + Math.random()*(hi-lo);
}



function draw_score_window(ctx) {

	var score = hits * 50;
	var current_time = new Date()
	var elapsed_time = Math.round((current_time.getTime() - start_time.getTime()) / 100)
	
	var tenths_of_seconds = Math.floor(elapsed_time % 10);
	var seconds = Math.floor(elapsed_time / 10);
	
	
	var status_html = "<table style='width:100%;border:0px;color:green'><tr><td style='text-align:left'>Score</td><td style='text-align:right'>" + score + "</td></tr><tr><td style='text-align:left'>Time</td><td style='text-align:right'>" + seconds + "." + tenths_of_seconds + "</td></tr></table>"
	
	// Just for test
	if (secondPlayer) {status_html = secondPlayer.y}
	
	$("#score_window").html(status_html); // Update score window

}


function draw_worker_bubble(camera)
{
	//$("#worker").
}


function drawBackground(ctx) {
    ctx.fillStyle = "#DDDDB0";
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}



function drawGround(ctx) {
    ctx.fillStyle = "#88ff00";
    ctx.fillRect(0,ground,SCREEN_WIDTH,SCREEN_HEIGHT-ground);
}



function drawPlayer(ctx, p) {
   
   	//ctx.fillStyle = "#FF0000";
    //player.fillRect(ctx);
    
    ctx.save();    
	ctx.translate(p.x - p.w/2,p.y+p.h/2);
    var slice = playerAnim[playerAnim.name][playerAnim.index];

    ctx.scale(playerAnim.dir, 1);
    if (playerAnim.dir < 0) {
    	var x_offset = -192
    } else {
    	 var x_offset = -64
    }
	ctx.drawImage(sprite, slice.x,slice.y,64,64, x_offset,-152,128*2,128*2);   
	ctx.restore();    
}




function drawplayer_desk(ctx) {

    ctx.fillStyle = "#FF0000";
    //player_desk.fillRect(ctx);
    
    ctx.save();
	ctx.translate(player_desk.x,player_desk.y);
    ctx.drawImage(sprite, player_desk_sprite_x,64*3, 64,64, -60,-91, 128*2,128*2);  // Computer desk
    ctx.drawImage(sprite,0,64*3,64,64,-48,-140,128*2,128*2);						// Computer
    ctx.restore();   
}

function draw_filing_cabinet(ctx) {

    //ctx.fillStyle = "#FF0000";
    //filing_cabinet.fillRect(ctx);
    
    ctx.save();
	ctx.translate(filing_cabinet.x,filing_cabinet.y);
    ctx.drawImage(sprite, 63*4,64*3, 64,64, -108,-91, 128*2,128*2);
    ctx.restore();
    
}



function draw_computer_screen(ctx) {
   
	if (!panic_mode && show_terminal) {
		$("#overlay").show();
		$("#panic_window").hide();
 	} else if (panic_mode) {
 	
		$("#overlay").hide();
		//$("#panic_window").show();
		
		// Panic window doesn't scroll, so calculate position based on camera position.
		//var panic_position = 50 - camera;
		//$("#panic_window").css("left", panic_position);
		
		ctx.drawImage(panic_image, 0 ,0 , 105,131, 50 , 50, 105*2,131*2);
			
 	} else {
 		// Not in panic or terminal mode
 		$("#overlay").hide();
 		$("#panic_window").hide();
 	}    
}


// Loop through all the workers -- drawing them and their desks
function draw_workers(ctx) {
    
    for(var i in workers) {    
        // Draw Desk
        //ctx.fillStyle = "#0000FF";
        //workers[i].location.fillRect(ctx);
        ctx.save();
		ctx.translate(workers[i].location.x,workers[i].location.y);
		ctx.drawImage(sprite, workers[i].desk_sprite_x,64*3, 64,64, -100,-91, 128*2,128*2);
		ctx.drawImage(sprite, workers[i].computer_sprite_x,64*3, 64,64, -80,-128, 128*2,128*2);		
		ctx.restore();
         
         // Draw worker 
        ctx.save();      
        ctx.translate(workers[i].location.x - workers[i].location.w/2,workers[i].location.y+workers[i].location.h/2);
		var slice = playerAnim[workers[i].anim_name][workers[i].anim_index];
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.drawImage(sprite, slice.x,workers[i].sprite_y, 64,64, -64,-152, 128*2,128*2);
		ctx.restore();  
		
		// If guilty, draw computer screen	
		if (panic_mode && workers[i].guilty) {
			ctx.fillStyle = "#000000";
    		ctx.fillRect(workers[i].location.x - 150,150,400,300);
    		
    		// Enter text
    		ctx.fillStyle = "green";
    		ctx.textAlign = 'left';
    		ctx.font = "normal 16pt 'Courier' ";
    		
    		// Every few ticks, add another asterisk to the password line.  When whole password has been entered, 
    		// player looses a life
    		if ( ((tick - workers[guilty_worker].start_guilt_tick) % 100) == 0) {
    			var new_text = workers[i].guilty_worker_text[2] + "*";
    			workers[i].guilty_worker_text[2] = new_text;
    			console.log(tick, workers[guilty_worker].start_guilt_tick, tick/workers[guilty_worker].start_guilt_tick);
    			
    		}
    		
    		for (var line in workers[i].guilty_worker_text) {
    			ctx.fillText(workers[i].guilty_worker_text[line],workers[i].location.x - 140,180 + 40*line);
    		}		
		}
    } // End of loop through workers
}  




function drawEffects(ctx) {
    effects.forEach(function(ef) {
        ef.tick();
        ef.draw(ctx);
    });
}


function randColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function ParticleEffect() {
	this.x = 0;
	this.y = 0;
	this.age = 0;
	this.parts = [];
	this.rate = 10;
	this.max = 1;
	this.maxage = 200;
	this.color = "#aaaaaa";
	this.alive = true;
	this.initParticle = function(part) {
		return part;
	}
	this.tick = function() {
		this.age++;
		if(this.age > this.maxage) {
			this.alive = false;
			return;
		}
		if((this.age % this.rate) == 0 && this.parts.length < this.max) {
		
			// Default part
			var part = {
				x:this.x,
				y:this.y,
				dx: rand(-3,3),
				dy: rand(-5,0),
				alpha:0.5,
				dalpha:-0.01,
				color: "#EEEEEE"
				};

			var part2 = {
				x:this.x,
				y:this.y,
				dx: rand(-3,3),
				dy: rand(-5,0),
				alpha:0.5,
				dalpha:-0.01,
				color: "#EEEEEE"
				};
		
			// Generate steam based on which direction player is moving
			// Adjust defaults as needed
			if ( (playerAnim.name == "walking" || playerAnim.name == "jumping") && playerAnim.dir >= 0) {
				part.dx = rand(-2,0);		// Walking right
				part.x = player.x + rand(-10,0);
				part.y = player.y + rand(25,35);
				this.parts.push(this.initParticle(part));				
			} else if ((playerAnim.name == "walking" || playerAnim.name == "jumping") && playerAnim.dir < 0) {
				part.x = player.x + rand(45,55);
				part.y = player.y + rand(25,35);
				this.parts.push(this.initParticle(part));
				
			} else if (playerAnim.name == "idle" || playerAnim.name == "typing") {
				part.dx = rand(-3,0);		// Walking left
				part.x = part.x - 45;
				part.y = player.y + rand(25,35);
				//x = Math.round(player.x + player.w);	// Shift particles to the right
				this.parts.push(this.initParticle(part));
				
				// Create another for the right ear
				part2.dx = rand(0,3);		// Walking left
				part2.x = part.x + 60;
				part2.y = player.y + rand(25,35);
				//x = Math.round(player.x + player.w);	// Shift particles to the right
				this.parts.push(this.initParticle(part2));
		 	}
			
		}
		for(var i=0; i<this.parts.length; i++) {
			var p = this.parts[i];
			p.y += p.dy;
			p.x += p.dx;
			p.alpha += p.dalpha;
		}
	}
	this.draw = function(g) {
		if(!this.alive) return;
		g.save();
		for(var i=0; i<this.parts.length; i++) {
			var p = this.parts[i];
			if(p.alpha < 0) continue;
			g.fillStyle = p.color;
			g.globalAlpha = p.alpha;
			g.fillRect(p.x,p.y,20,20);
			//g.arc(p.x,p.y,20, 0, 2 * Math.PI);
			//g.fill();
		}
		g.restore();
	}
}






