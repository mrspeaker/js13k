var Player = function() {
	this.w = 12;
	this.h = 23;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
	this.wasFalling = false;
	this.onLadder = false;
	this.wasOnLadder = false;
	this.dir = 1;

	this.trapLaunch = -1;
};
Player.prototype = new Entity;
Player.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	this.initpos = [x, y];

	this.projectiles = [];
	this.traps = [];

	this.offs = {
		headX: 2,
		headY: -3,
		bodyX: 0,
		bodyY: 5
	}

	return this;
},
Player.prototype.tick = function (input, map) {

	var speed = 0.9;

	this.projectiles = this.projectiles.filter(function (p) {
		return p.tick(map);
	});
	this.traps = this.traps.filter(function (t) {
		return t.tick(map);
	});

	if (input.isDown("up")) {
		if (this.inWater || (this.onLadder && !this.onTopOfLadder)) {
			this.acc[1] -= speed;
		} else {
			if (!this.falling && !this.wasFalling) {
				audio.sfx.jump();
				this.acc[1] = -map.sheet.h - 1;
				this.vel[1] = 0;
				this.falling = true;
			}
		}
	}
	if (input.isDown("down")) {
		if (input.isDown("fire")) {
			if (this.trapLaunch < 0) {
				this.trapLaunch = 20;
			} else {
				if (--this.trapLaunch === -1) {
					this.trapLaunch = 1000; // TODO: just release fire button.
					this.traps.push(
						new Trap().init(this.x, this.y - 2 - 24)
					);
				}
			}
		} else {
			// Move downwards
			this.trapLaunch = -1;
			this.acc[1] += speed;
		}
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
		audio.sfx.shoot();
	}

	this.tickVelocity();

	this.wasFalling = this.falling;
	this.move(this.xo, this.yo, map);
	this.checkBlocks(input, map);

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
Player.prototype.hit = function (e) {
	if (e instanceof Piece) {
		e.remove = true;
		audio.sfx.pickup();
	}
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

Player.prototype.isMoving = function () {
	return Math.abs(this.vel[0]) > 0.3 || Math.abs(this.vel[1]) > 0.3;
};
Player.prototype.hitBlocks = function (x, y) {

	if ((x && x.indexOf(BLOCKS.type.LAVA) > -1) || (y && y.indexOf(BLOCKS.type.LAVA) > -1)) {
		this.x = this.initpos[0];
		this.y = this.initpos[1];
	}

};
Player.prototype.checkBlocks = function (input, map) {

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
				if (!input.isDown("down")) {
					this.vel[1] = 0;
				}
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
	}
	if (blocks.indexOf(BLOCKS.type.WATERLEFT) > -1) {
		this.xo -= 4;
		this.inWater = true;
	}

};
Player.prototype.render = function (c) {

	c.shadowBlur = 0;

	this.projectiles.forEach(function (p) {
		return p.render(c);
	});

	this.traps.forEach(function (t) {
		return t.render(c);
	});

	c.strokeStyle = "#000";

	// body
	c.fillStyle = "hsl(10, 70%, 30%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(20, 30%, 40%)";
	if (!this.onLadder) {
		c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
		c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	} else {
		c.fillRect(this.x + 3, this.y + this.offs.headY, 6, 10);
		c.strokeRect(this.x + 3, this.y + this.offs.headY, 6, 10);
	}

	c.fillStyle = "hsl(55, 100%, 50%)";
	if (this.isMoving()) {
		if ((Date.now() / 100 | 0) % 2 === 0) {
			// legs and arms
			if (!this.onLadder) {
				c.fillRect(this.x + 2, this.y + 20, 3, 3);
				c.fillRect(this.x + 8, this.y + 20, 3, 3);
				c.fillRect(this.x + 4, this.y + 11, 3, 5);
			} else {
				// Arms
				c.fillRect(this.x - 2, this.y + 2, 3, 5);
				c.fillRect(this.x + 11, this.y + 8, 3, 5);

				// Legs
				c.fillRect(this.x + 2, this.y + 20, 3, 2);
				c.fillRect(this.x + 8, this.y + 20, 3, 4);

			}
		} else {
			if (!this.onLadder) {
				c.fillRect(this.x + 4, this.y + 20, 4, 3);
				c.fillRect(this.x + 5, this.y + 11, 3, 5);
			} else {
				// Arms
				c.fillRect(this.x - 2, this.y + 8, 3, 5);
				c.fillRect(this.x + 11, this.y + 2, 3, 5);

				// Legs
				c.fillRect(this.x + 2, this.y + 20, 3, 4);
				c.fillRect(this.x + 8, this.y + 20, 3, 2);
			}
		}
	} else {
		// Standing still.
		if (!this.onLadder || this.wasFalling) {
			c.fillRect(this.x + 2, this.y + 20, 3, 3);
			c.fillRect(this.x + 8, this.y + 20, 3, 3);
			c.fillRect(this.x + 4, this.y + 11, 3, 5);
		} else {
			// Arms
			c.fillRect(this.x - 2, this.y + 8, 3, 5);
			c.fillRect(this.x + 11, this.y + 2, 3, 5);

			// Legs
			c.fillRect(this.x + 2, this.y + 20, 3, 4);
			c.fillRect(this.x + 8, this.y + 20, 3, 2);
		}
	}


};
