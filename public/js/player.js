// Define the player object

function Player(name, player_width, player_height) {

	// Geometry settings
	this.width = player_width;
	this.height = player_height;


	// location settings
	this.x = (config.SCREEN_WIDTH/2 - this.width/2) |0;
	this.y = app.ground - this.height;
	
	// Changes in position
	this.dx = 0;
	this.dy = 0;
		
	// Score settings
	this.hits = 0;


	// Box for character
	//this.box = new Box(this.x,this.y,this.width,this.height);


	// Sprite setup
	this.sprite = new Image();
	this.sprite.src = "/img/sprites/nick-sprite.png";
	
	this.panic_image = new Image();
	this.panic_image.src = "/img/skull.png";

	// Animation Settings
	this.anim = new Mainplayer_animations();
	this.anim.index = 0;
	this.anim.name = "idle";
	this.anim.dir = 1;		/// Direction
	
	
	this.getRight 	= 	function() 	{ return getRight(this); }
	this.getLeft 	= 	function()	{ return getLeft(this); }
	this.getTop 	= 	function() 	{ return getTop(this); }
	this.getBottom  = 	function() 	{ return getBottom(this); }
	this.setBottom	= 	function(b) { setBottom(this, b) }	
	this.intersects = 	function(b) { return intersects(this, b); }
	
	
	this.status = function() { return person_status(this);}
	
}



// Given a person, return their status as a JSON object
function person_status(p) {
	var s = {
		x: p.x,
		y: p.y,
		width: p.width,
		height: p.height,
		anim: p.anim
	}
	
	return s;
}



// Definition of a basic box -- used for collisions, etc.
function Box(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.sprite = new Image();
	
	this.fillRect = function(ctx) {
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	
	this.getRight 	= function() { return getRight(this); }
	this.getLeft 	= function() { return getLeft(this); }
	this.getTop 	= function() { return getTop(this); }
	this.getBottom 	= function() { return getBottom(this); }
	this.setBottom	= function(b) { setBottom(this, b) }
	this.intersects	= function(b) { return intersects(this, b); }
	
}










// Load sprite locations for different types of animations for a main player
function Mainplayer_animations() {

	this.typing = [];
	for(var i= 0; i<4; i++) {
		this.typing.push({x:i*64, y:0});
	}
	
	//Set up idle animation
	this.idle = [];
	for(var i= 0; i<2; i++) {
		this.idle.push({x:i*64, y:128});
	}

	this.walking = [];
	for(var i= 0; i<8; i++) {
		this.walking.push({x:i*64, y:64});
	}
	
	this.jumping = [];
	for(var i= 0; i<8; i++) {
		this.jumping.push({x:i*64, y:64});
	}

}




	

	
	
function getRight(p) { return p.x + p.width; }
function getLeft(p) { return p.x;}
function getTop(p) { return p.y;}
function getBottom(p) { return p.y + p.height;}
function setBottom(p, b) { p.y = b - p.height}


// Do objects a and b intersect?
function intersects(a, b) {
	if(a.getRight() >= b.getLeft()  && a.getLeft() <= b.getRight()) {
		if(a.getBottom() >= b.getTop() && a.getTop() <= b.getBottom()) {
			return true;
		}
	}		
	return false;    	
}





