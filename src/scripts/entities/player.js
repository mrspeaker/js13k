var Player = function() {
	this.w = 12;
	this.h = 23;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
	this.onLadder = false;
	this.wasOnLadder = false;
	this.dir = 1;
};
Player.prototype = new Entity;
Player.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	this.projectiles = [];

	return this;
},
Player.prototype.tick = function (input, map) {

	var speed = 0.9;

	this.projectiles = this.projectiles.filter(function (p) {
		return p.tick(map);
	});

	if (input.isDown("up")) {
		if (this.inWater || (this.onLadder && !this.onTopOfLadder)) {
			this.acc[1] -= speed;
		} else {
			if (!this.falling) {
				audio.sfx.jump();
				this.acc[1] = -map.sheet.h - 1;
				this.vel[1] = 0;
				this.falling = true
			}
		}
	}
	if (input.isDown("down")) {
		this.acc[1] += speed;
	}
	if (input.isDown("left")) {
		this.acc[0] -= speed;
		this.dir = -1;
	}
	if (input.isDown("right")) {
		this.acc[0] += speed;
		this.dir = 1;
	}
	if (input.pressed("fire")) {
		this.projectiles.push(
			new Spear().init(this.x, this.y, this.dir)
		);
	}

	this.tickVelocity();
	this.move(this.xo, this.yo, map);

	this.checkBlocks(map);

};

Player.prototype.tickVelocity = function () {
	this.grav = this.falling ? this.grav + 0.25 : 0;
	this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1] + this.grav];
	this.vel = [this.vel[0] * this.friction, this.vel[1] * this.friction];

	this.acc = [0, 0];

	if (Math.abs(this.vel[0]) < 0.01) this.vel[0] = 0;
	if (Math.abs(this.vel[1]) < 0.01) this.vel[1] = 0;

	this.xo += this.vel[0];
	this.yo += this.vel[1];
};

Player.prototype.hitSpear = function (spear) {
	if (spear.stuck) {
		this.onLadder = true;
		this.falling = false;
		if (this.y + this.h - spear.y < 10) {
			this.onTopOfLadder = true;
			this.y = spear.y - this.h;
		}
	} else {
		this.onTopOfLadder = false;
	}
};

Player.prototype.checkBlocks = function (map) {

	this.wasOnLadder = this.onLadder;

	var blocks = map.getBlocks([
		[this.x, this.y],
		[this.x, this.y + (this.h - 1)],
		[this.x + (this.w - 1), this.y],
		[this.x + (this.w - 1), this.y + (this.h - 1)]
	]);

	this.onTopOfLadder = false;
	if (blocks.indexOf(BLOCKS.type.LADDER) > -1) {
		if (!this.wasOnLadder) {
			if (blocks[0] !== BLOCKS.type.LADDER && blocks[2] !== BLOCKS.type.LADDER) {
				// Snap to top.
				this.y = utils.snap(this.y, map.sheet.h) + (map.sheet.h - this.h);
				this.onTopOfLadder = true;
			}
		}
		this.onLadder = true;
		this.falling = false;
	} else {
		this.onLadder = false;
	}

	this.inWater = false;
	if (blocks.indexOf(BLOCKS.type.WATER) > -1) {
		this.yo += 4;
		this.inWater = true;
		this.falling = false;
	}
	if (blocks.indexOf(BLOCKS.type.WATERRIGHT) > -1) {
		this.xo += 4;
		this.inWater = true;
		//this.falling = false;
	}
	if (blocks.indexOf(BLOCKS.type.WATERLEFT) > -1) {
		this.xo -= 4;
		this.inWater = true;
		//this.falling = false;
	}

};
Player.prototype.render = function (c) {
	this.projectiles.forEach(function (p) {
		return p.render(c);
	});
	c.fillStyle = "#22f";
	c.fillRect(this.x, this.y, this.w, this.h);

};
