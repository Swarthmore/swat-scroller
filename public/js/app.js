// Main SwatScroller JavaScript app

var app = {

	pressed: {},
	sprite: new Image(),
	sprite.src: "nick-sprite.png",
	panic_image: new Image(),
	panic_image.src: "skull.png",
	dir: 1,			// Player direction
	playerAnim: {},	// Player animation setting
	show_terminal=false, //Show terminal window
	ip_listing: [],
	tick: 0,
	camera: 0, 				// declare the camera
	jumping: false,

	ground: 0.82*SCREEN_HEIGHT,

	player: new Box(SCREEN_WIDTH/2 - PLAYER_WIDTH/2,ground-PLAYER_HEIGHT,PLAYER_WIDTH,PLAYER_HEIGHT),
	
	otherPlayers = [],
	
	player_desk: new Box(Math.floor(SCREEN_WIDTH*0.05),Math.floor(ground-DESK_HEIGHT),DESK_WIDTH,DESK_HEIGHT),
	computer_screen: new Box(Math.floor(SCREEN_WIDTH*0.01), Math.floor(SCREEN_HEIGHT*0.05), COMPUTER_SCREEN_WIDTH,COMPUTER_SCREEN_HEIGHT),
	filing_cabinet,


	panic_mode: false,
	panic_button_pressed: false,
	lock_computer: false, 
	player_desk_sprite_x: 0,
	guilty_worker: -1,
	hits: 0,
	effects: [],
	ctx,	// The Canvas screen context
	start_time,

	terminal_listing: [],

	domain_names: ["facebook.com","youtube.com","yahoo.com","live.com","msn.com","wikipedia.org","blogspot.com","baidu.com","microsoft.com","qq.com","bing.com","ask.com","adobe.com","taobao.com","twitter.com","youku.com","soso.com","wordpress.com","sohu.com","hao123.com","windows.com","163.com","tudou.com","amazon.com","apple.com","ebay.com","4399.com","yahoo.co.jp","linkedin.com","go.com","tmall.com","paypal.com","sogou.com","ifeng.com","aol.com","xunlei.com","craigslist.org","orkut.com","56.com","orkut.com.br","about.com","skype.com","7k7k.com","dailymotion.com","flickr.com","pps.tv","qiyi.com","bbc.co.uk","4shared.com","mozilla.com","ku6.com","imdb.com","cnet.com","babylon.com","mywebsearch.com","alibaba.com","mail.ru","uol.com.br","badoo.com","cnn.com","myspace.com","netflix.com","weather.com","soku.com","weibo.com","renren.com","rakuten.co.jp","17kuxun.com","yandex.ru","booking.com","ehow.com","bankofamerica.com","58.com","zedo.com","2345.com","globo.com","mapquest.com","goo.ne.jp","answers.com","360.cn","chase.com","naver.com","hp.com","odnoklassniki.ru","alipay.com","huffingtonpost.com","ameblo.jp","ganji.com","alot.com","scribd.com","megaupload.com","tumblr.com","softonic.com","camzap.com","vkontakte.ru","avg.com","walmart.com","pptv.com","xinhuanet.com","mediafire.com"]
};


app.config = {
	
	SCREEN_WIDTH: 1024,
	SCREEN_HEIGHT: 768,

	PLAYER_WIDTH: 64,
	PLAYER_HEIGHT: 128,

	DESK_WIDTH: 64,
	DESK_HEIGHT: 128,
	FILING_CABINET_HEIGHT: 128,

	COMPUTER_SCREEN_WIDTH: 600,
	COMPUTER_SCREEN_HEIGHT: 300,

	PANIC_WIDTH: 400,
	PANIC_HEIGHT: 130,

	NUMBER_OF_WORKERS: 6,
	WORKER_SPACING: 300,  // in pixels

	HITS_TO_WIN: 5,
	WORKER_PASSWORD_LENGTH: 8,
	
	MAX_TERMINAL_LISTING: 30,
	
}



function update_secondplayer(data) {
	secondPlayer = data;
}



var workers = [];


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();



setup();
window.requestAnimFrame(gameLoop);



function setup() {

	// Set up screen
	ctx= document.getElementById('canvas').getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;

	// Setup player
	playerAnim.index = 0;
	playerAnim.name = "idle";
	player.dx = 0;
	player.dy = 0;
	hits = 0;
	player_desk_sprite_x = 64*Math.round(rand(2,3))	// Pick a desk style at random


	// Set up typing animation
	// Load sprite locations for different types of animations
	playerAnim.typing = [];
	for(var i=0; i<4; i++) {
		playerAnim.typing.push({x:i*64, y:0});
	}
	//Set up idle animation
	playerAnim.idle = [];
	for(var i=0; i<2; i++) {
		playerAnim.idle.push({x:i*64, y:128});
	}

	playerAnim.walking = [];
	for(var i=0; i<8; i++) {
		playerAnim.walking.push({x:i*64, y:64});
	}
	playerAnim.jumping = [];
	for(var i=0; i<8; i++) {
		playerAnim.jumping.push({x:i*64, y:64});
	}

	// Generate workers
	for(var i=0; i<NUMBER_OF_WORKERS; i++) {
		workers[i] = {}
		workers[i].location = new Box(1*SCREEN_WIDTH + i*WORKER_SPACING, Math.floor(ground-DESK_HEIGHT),DESK_WIDTH,DESK_HEIGHT);
		workers[i].anim_index = i;
		workers[i].anim_name = "typing"
		workers[i].sprite_y = 64*Math.floor(rand(4,7));		// Workers are in rows 5-7
		workers[i].computer_sprite_x = 64*Math.round(rand(0,1));
		workers[i].desk_sprite_x = 64*Math.round(rand(2,3));
		workers[i].guilty = false;
		workers[i].start_guilt_tick = 0;
		workers[i].guilty_worker_text = [];
	}
	
	// Place filing cabinet
	filing_cabinet = new Box(0.65*SCREEN_WIDTH, ground - FILING_CABINET_HEIGHT,50,FILING_CABINET_HEIGHT);
	
	// Set up keypress listening
	document.addEventListener('keydown',function(e) { 
		pressed[e.keyCode] = true;   
	});
	document.addEventListener('keyup',  function(e) {  
		pressed[e.keyCode] = false;  
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
	processAnimations();
	draw(ctx);
	window.requestAnimFrame(gameLoop);
}




function updateGameState() {

	// Assume player is idle and set default direction to right.
	// If not, these settings will be adjusted later
	playerAnim.name = "idle";
	playerAnim.dir = 1

	// Only check player keys when not actively using the terminal.
	// This is when the terminal isn't visible or the terminal is visible but locked.
	if (!show_terminal || (show_terminal && lock_computer)) {
	
		if (pressed[37] == true) {	// 37 = left arrow
			player.x -= 8;
			playerAnim.name = "walking";
			playerAnim.dir = -1;
		}
		if (pressed[39] == true) {	// 39 = right arrow
			player.x += 8;
			playerAnim.name = "walking";
		}
		if (pressed['T'.charCodeAt(0)] == true) {
			playerAnim.name = "typing";
		}	

		if(pressed[' '.charCodeAt(0)] == true) {
			// Only permit jumps if not already pressing the jump key and not already jumping
			if( !jumping && player.getBottom() >= ground) {
				player.dy -= 20;
				jumping = true;
			}
		} else {
			jumping = false;
		}
    
    
		if(pressed['P'.charCodeAt(0)] == true) {
			// If the panic mode button was just pressed, toggle panic mode
			if (!panic_button_pressed) {
				panic_mode = !panic_mode;   
				if (panic_mode) {
					start_panic_mode();    	// Take care of panic mode settings 		
				} else {
					workers[guilty_worker].guilty = false;		// Turn off guilty worker
				}
			}
			panic_button_pressed = true;
			lock_computer = true;
		} else {
			panic_button_pressed = false;
		}
		
		// End of keys to check when terminal is locked
	} else {
		// Escape key
		if(pressed[27] == true) {
			lock_computer = true;
			console.log("Lock computer");
		}
	}
	
	
    player.y += player.dy;
    player.dy += 1;

	// Move the camera to scroll the screen 
	// Don't scroll past the starting point
	camera = Math.max(0, player.x - Math.floor(SCREEN_WIDTH/2));   


	// Send new location to the server
	send_player_status_to_server(player);

}
















function start_panic_mode()
{
	// Go into panic mode.  Hide and lock the terminal so the player can use the control keys
	panic_mode = true;
	lock_computer = true;
	$("#player_input").blur();

	// Clear any old guilt info from workers
	for (var w in workers) {
		workers[w].guilty = false;
	}

	// Pick which worker has the emergency 
	guilty_worker = Math.floor(rand(0, NUMBER_OF_WORKERS));
	workers[guilty_worker].guilty = true;
	workers[guilty_worker].start_guilt_tick = tick;
	workers[guilty_worker].guilty_worker_text = ["Welcome to Facebook!", "Username: *******", "Password: "];	
}










    
    
    
    
    
function draw(ctx) {
    drawBackground(ctx);
    drawGround(ctx);
    ctx.save();
    ctx.translate(-camera,0);
	draw_computer_screen(ctx);
    drawplayer_desk(ctx);
    draw_workers(ctx);
    draw_filing_cabinet(ctx);
    drawPlayer(ctx, player); 
    if (secondPlayer) {drawPlayer(ctx, secondPlayer);  }
    drawEffects(ctx);
    ctx.restore();
    draw_worker_bubble(camera);
    draw_score_window(ctx)
}



