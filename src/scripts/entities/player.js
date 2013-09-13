var Player = function() {
	this.w = 12;
	this.h = 23;
	this.xp = 0;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
	this.wasFalling = false;
	this.onLadder = false;
	this.wasOnLadder = false;
	this.dir = 1;

	this.numPickups = 0;
	this.numTraps = 0;
	this.pieces = [false, false, false, false];

	this.trapLaunch = -1;
	this.crouching = false;

	this.deaded = false;
	this.jumpHeight = -game.th - 1;

	this.firing = 0;

};
Player.prototype = new Entity;
Player.prototype.init = function (x, y, level) {

	this.x = x;
	this.y = y;
	this.level = level;

	this.checkpoint = [this.x, this.y];

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
Player.prototype.complete = function () {
	var p = this.pieces;
	return p[0] + p[1] + p[2] + p[3];
};
Player.prototype.tick = function (input, map) {

	if (this.deaded) {
		this.tickDead(input, map);
		return;
	}

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
				this.jump();
			}
		}
	}
	if (input.wasDown("down")) {
		this.crouching = false;
	}
	if (input.isDown("down")) {
		if (!this.falling) {
			this.crouching = true;
		}
		if (input.isDown("fire") && this.numTraps > 0) {
			if (this.trapLaunch < 0) {
				this.trapLaunch = 20;
				audio.sfx.swiggle();
			} else {
				if (--this.trapLaunch === -1) {
					this.trapLaunch = 1000; // TODO: just release fire button.
					this.numTraps--;
					this.traps.push(
						new Trap().init(this.x, this.y - 2 - 24)
					);
					this.traps.forEach(function (t) {
						t.setClosestPiece(this.level.pieces);
					}, this);
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
	if (input.pressed("fire") && !this.crouching) {
		this.firing = 10;
		this.projectiles.push(
			new Spear().init(this.x, this.y, this.dir)
		);
		audio.sfx.shoot();
	}

	this.tickVelocity();

	this.wasFalling = this.falling;
	this.move(this.xo, this.yo, map);

	if (this.x < 5) this.x = 5;
	if (this.y < -3) this.y = -3;
	if (this.x > map.w - 5) this.x = map.w -5;


	this.checkBlocks(input, map);

	if (this.onLadder) {
		this.crouching = false;
	}

};
Player.prototype.jump = function () {
	this.acc[1] = this.jumpHeight;
	this.vel[1] = 0;
	this.falling = true;
};
Player.prototype.tickDead = function () {
	var dx = this.x - this.checkpoint[0],
		dy = this.y - this.checkpoint[1],
		deadSpeed = 10;

	if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
		this.x = this.checkpoint[0];
		this.y = this.checkpoint[1];
		this.jump();
		this.deaded = false;
	}

	this.x += Math.abs(dx) < 20 ? 0 : (this.x < this.checkpoint[0] ? deadSpeed : -deadSpeed);
	this.y += Math.abs(dy) < 20 ? 0 : (this.y < this.checkpoint[1] ? deadSpeed : -deadSpeed);

};

Player.prototype.tickVelocity = function () {
	this.grav = Math.min(this.falling ? this.grav + 0.23 : 0, 2.3);

	this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1] + this.grav];
	this.vel = [this.vel[0] * this.friction, this.vel[1] * this.friction];

	this.acc = [0, 0];

	if (Math.abs(this.vel[0]) < 0.01) this.vel[0] = 0;
	if (Math.abs(this.vel[1]) < 0.01) this.vel[1] = 0;

	this.xo += this.vel[0];
	this.yo += this.vel[1];
};

Player.prototype.hit = function (e) {
	if (e instanceof Pickup) {
		e.remove = true;
		this.level.xp(e);
		// Befor you needed multipe pickups to make a trap. remove this.
		audio.sfx.pickup();
		this.numTraps++;
		if(this.numPickups++ === 0) {
			this.level.firstPickup();
		};
		return;
	}
	if (e instanceof Ghoul) {
		this.killed(e);
		return;
	}

	if (e instanceof Piece) {
		e.remove = true;
		var p = this.pieces;
		p[e.id] = true;
		this.checkpoint = [this.x, this.y];
		this.level.xp(e);
		if (this.complete() === 4) {
			this.level.winsTheGame();
		} else {
			if (this.complete() === 1) {
				this.level.firstPiece();
			}
			this.traps.forEach(function (t) {
				t.setClosestPiece(this.level.pieces.filter(function (p) {
					return p !== e;
				}));
			}, this);
		}
		return;
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
	return Math.abs(this.vel[0]) > 0.3 || (!this.crouching && Math.abs(this.vel[1]) > 0.3)
};

Player.prototype.killed = function (e) {
	e && this.level.xp({xpValue:e.xpAttackValue});
	this.level.explode(this.x + this.w / 2, this.y + this.h);
	this.deaded = true;
};
Player.prototype.hitBlocks = function (x, y) {

	if ((x && x.indexOf(BLOCKS.type.LAVA) > -1) || (y && y.indexOf(BLOCKS.type.LAVA) > -1)) {
		this.killed();
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

	// draw checkpoint
	var grd = c.createLinearGradient(this.checkpoint[0] + game.tw / 2, this.checkpoint[1], this.checkpoint[0] + game.tw / 2, this.checkpoint[1] + game.th);
	grd.addColorStop(0, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(Math.random() * 0.3, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(1, "hsla(" + (Math.random() * 130 + 40 | 0) +", 100%, 50%, 1)");
	c.fillStyle = grd;
	c.fillRect(this.checkpoint[0], this.checkpoint[1], game.tw, game.th - 3);

	c.fillStyle = "#dd0";
	c.fillRect(this.checkpoint[0], this.checkpoint[1] + game.th - 3, game.tw, 3);


	// Draw thrwing arm
	if (this.firing-- > 0 && !this.onLadder) {
		c.fillStyle = "hsl(55, 100%, 50%)";
		c.fillRect(this.x + (4 * -this.dir) + 6 + (-this.firing / 5), this.y -2 , 2, 5);
	}

	this.projectiles.forEach(function (p) {
		return p.render(c);
	});

	this.traps.forEach(function (t) {
		return t.render(c);
	});

	c.strokeStyle = "#000";
	c.lineWidth = 2;



	// body
	c.fillStyle = "hsl(10, 70%, 30%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(20, 30%, 40%)";

	if (!this.onLadder) {
		c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY + (this.crouching * 4), 6, 10);
		c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY + (this.crouching * 4), 6, 10);
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
