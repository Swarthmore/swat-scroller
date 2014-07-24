// Main SwatScroller JavaScript app

var app = {

	pressed: {},

	show_terminal: false, //Show terminal window
	ip_listing: [],
	tick: 0,
	camera: 0, 				// declare the camera
	jumping: false,

	ground: 0.82*config.SCREEN_HEIGHT |0,  // Round down to int
	
	player: {},
	otherPlayers: [],
	workers: [],
	
	player_desk: {},
	computer_screen: new Box(Math.floor(config.SCREEN_WIDTH*0.01), Math.floor(config.SCREEN_HEIGHT*0.05), config.COMPUTER_SCREEN_WIDTH,config.COMPUTER_SCREEN_HEIGHT),
	filing_cabinet: {},


	panic_mode: false,
	panic_button_pressed: false,
	lock_computer: false, 
	player_desk_sprite_x: 0,
	guilty_worker: -1,
	hits: 0,
	effects: [],
	ctx: {},	// The Canvas screen context
	start_time: 0,

	terminal_listing: [],

	domain_names: ["facebook.com","youtube.com","yahoo.com","live.com","msn.com","wikipedia.org","blogspot.com","baidu.com","microsoft.com","qq.com","bing.com","ask.com","adobe.com","taobao.com","twitter.com","youku.com","soso.com","wordpress.com","sohu.com","hao123.com","windows.com","163.com","tudou.com","amazon.com","apple.com","ebay.com","4399.com","yahoo.co.jp","linkedin.com","go.com","tmall.com","paypal.com","sogou.com","ifeng.com","aol.com","xunlei.com","craigslist.org","orkut.com","56.com","orkut.com.br","about.com","skype.com","7k7k.com","dailymotion.com","flickr.com","pps.tv","qiyi.com","bbc.co.uk","4shared.com","mozilla.com","ku6.com","imdb.com","cnet.com","babylon.com","mywebsearch.com","alibaba.com","mail.ru","uol.com.br","badoo.com","cnn.com","myspace.com","netflix.com","weather.com","soku.com","weibo.com","renren.com","rakuten.co.jp","17kuxun.com","yandex.ru","booking.com","ehow.com","bankofamerica.com","58.com","zedo.com","2345.com","globo.com","mapquest.com","goo.ne.jp","answers.com","360.cn","chase.com","naver.com","hp.com","odnoklassniki.ru","alipay.com","huffingtonpost.com","ameblo.jp","ganji.com","alot.com","scribd.com","megaupload.com","tumblr.com","softonic.com","camzap.com","vkontakte.ru","avg.com","walmart.com","pptv.com","xinhuanet.com","mediafire.com"]
};






$( document ).ready(function() {
	setup();
	window.requestAnimFrame(gameLoop);
});



function setup() {

	// Set up screen
	app.ctx = $('#canvas')[0].getContext('2d');
	app.ctx.imageSmoothingEnabled = false;
	app.ctx.mozImageSmoothingEnabled = false;
	app.ctx.webkitImageSmoothingEnabled = false;

	// Setup player
	app.player = new Player("Nick", config.PLAYER_WIDTH, config.PLAYER_HEIGHT);


	/*	player_desk_sprite_x = 64*Math.round(rand(2,3))	// Pick a desk style at random

	// Generate workers
	for(var i=0; i< config.NUMBER_OF_WORKERS; i++) {
		workers[i] = {}
		workers[i].location = new Box(1*config.SCREEN_WIDTH + i*config.WORKER_SPACING, Math.floor(app.ground-config.DESK_HEIGHT),config.DESK_WIDTH,config.DESK_HEIGHT);
		workers[i].anim_index = i;
		workers[i].anim_name = "typing"
		workers[i].sprite_y = 64*Math.floor(rand(4,7));		// Workers are in rows 5-7
		workers[i].computer_sprite_x = 64*Math.round(rand(0,1));
		workers[i].desk_sprite_x = 64*Math.round(rand(2,3));
		workers[i].guilty = false;
		workers[i].start_guilt_tick = 0;
		workers[i].guilty_worker_text = [];
	}
		*/
	
	
	// Place furniture
	app.filing_cabinet = new Box(0.65*config.SCREEN_WIDTH, app.ground - config.FILING_CABINET_HEIGHT,50,config.FILING_CABINET_HEIGHT);
	app.player_desk = new Box(Math.floor(config.SCREEN_WIDTH*0.05),Math.floor(app.ground-config.DESK_HEIGHT),config.DESK_WIDTH,config.DESK_HEIGHT);
	
	
	
	// Set up keypress listening
	document.addEventListener('keydown',function(e) { 
		app.pressed[e.keyCode] = true;   
	});
	document.addEventListener('keyup',  function(e) {  
		app.pressed[e.keyCode] = false;  
	});
	
	$("#player_input").keyup(function (e) {
		if (e.keyCode == 13) {
		   check_terminal_input()
		}
	});
	
	start_time = new Date();
	
}





// Main game loop
function gameLoop() {
	updateGameState();
	checkConditions();
	//processAnimations();
	draw();
	window.requestAnimFrame(gameLoop);
}




function updateGameState() {

	// Send new location to the server
	send_player_status_to_server(app.player.status());


	// Assume player is idle and set default direction to right.
	// If not, these settings will be adjusted later
	app.player.anim.name = "idle";
	app.player.anim.dir = 1

	// Only check player keys when not actively using the terminal.
	// This is when the terminal isn't visible or the terminal is visible but locked.
	if (!app.show_terminal || (app.show_terminal && app.lock_computer)) {
	
		if (app.pressed[37] == true) {	// 37 = left arrow
			app.player.x -= 8;
			app.player.anim.name = "walking";
			app.player.anim.dir = -1;
		}
		if (app.pressed[39] == true) {	// 39 = right arrow
			app.player.x += 8;
			app.player.anim.name = "walking";
		}
		if (app.pressed['T'.charCodeAt(0)] == true) {
			app.player.anim.name = "typing";
		}	

		if(app.pressed[' '.charCodeAt(0)] == true) {
			// Only permit jumps if not already pressing the jump key and not already jumping
			if( !app.jumping && app.player.getBottom() >= app.ground) {
				app.player.dy -= 20;
				app.jumping = true;
			}
		} else {
			app.jumping = false;
		}
    
    
		if(app.pressed['P'.charCodeAt(0)] == true) {
			// If the panic mode button was just pressed, toggle panic mode
			if (!app.panic_button_pressed) {
				app.panic_mode = !app.panic_mode;   
				if (app.panic_mode) {
					start_panic_mode();    	// Take care of panic mode settings 		
				} else {
					app.workers[guilty_worker].guilty = false;		// Turn off guilty worker
				}
			}
			app.panic_button_pressed = true;
			app.lock_computer = true;
		} else {
			app.panic_button_pressed = false;
		}
		
		// End of keys to check when terminal is locked
	} else {
		// Escape key
		if(app.pressed[27] == true) {
			app.lock_computer = true;
			console.log("Lock computer");
		}
	}
	
	
    app.player.y += app.player.dy;
    app.player.dy += 1;

	// Move the camera to scroll the screen 
	// Don't scroll past the starting point
	app.camera = Math.max(0, app.player.x - Math.floor(config.SCREEN_WIDTH/2));   




}






function start_panic_mode() {

	// Go into panic mode.  Hide and lock the terminal so the player can use the control keys
	panic_mode = true;
	lock_computer = true;
	$("#player_input").blur();

	// Clear any old guilt info from workers
	for (var w in workers) {
		workers[w].guilty = false;
	}

	// Pick which worker has the emergency 
	guilty_worker = Math.floor(rand(0, config.NUMBER_OF_WORKERS));
	workers[guilty_worker].guilty = true;
	workers[guilty_worker].start_guilt_tick = tick;
	workers[guilty_worker].guilty_worker_text = ["Welcome to Facebook!", "Username: *******", "Password: "];	
}





window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();





    
    
    
    
    
function draw() {
    drawBackground();
    drawGround();
    app.ctx.save();
    app.ctx.translate(-app.camera,0);
	//draw_computer_screen(ctx);
    //drawplayer_desk(ctx);
    //draw_workers(ctx);
    //draw_filing_cabinet(ctx);
    drawPlayer(app.player); 

    //drawEffects(ctx);
    app.ctx.restore();
    //draw_worker_bubble(app.camera);
    //draw_score_window(ctx)
}



