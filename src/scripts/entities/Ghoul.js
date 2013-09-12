var Ghoul = function () {
	this.w = 15;
	this.h = 22;
	this.dir = 1;
	this.speed = 1.1;
	this.angrySpeed = 1.5;
	this.life = 3;
	this.knockBack = 0;
	this.xpValue = 5;
	this.isAngry = false;
	this.foreverAngry = false;
	this.visible = false;
	this.notVisibleFor = 0;
};
Ghoul.prototype = new Entity;
Ghoul.prototype.init = function (x, y, dir, level) {
	this.x = x;
	this.y = y;

	this.level = level;

	this.speed = Math.random() + 0.6;
	this.angrySpeed = Math.random() * 0.5 + 1.2;

	this.dir = dir || 1;

	this.offs = {
		headX: 2,
		headY: -3,
		bodyX: 0,
		bodyY: 5
	}

	return this;
},
Ghoul.prototype.hit = function (e) {
	if (e instanceof Spear && !e.stuck) {
		this.knockBack = e.dir === this.dir ? 5 * e.dir : -12 * this.dir;
		if(this.life-- <= 0) {
			this.level.xp(this);
			this.remove = true;
		}
	}
	if (e instanceof Trap || e instanceof Player) {
		this.remove = true;
	}
};
Ghoul.prototype.tick = function (map) {
	var yo = 0,
		xo = 0,
		player;

	if (!this.visible) {
		if (this.notVisibleFor ++ > 2000) {
			return false;
		}
	} else {
		this.notVisibleFor = 0;
	}

	if (!this.isAngry) {
		yo = Math.sin(Date.now() / 100);
		xo = this.speed * this.dir;
	} else {
		player = this.level.player;
		var dist = utils.dist([this.x, this.y], [player.x, player.y]);
		if (this.foreverAngry || dist < 350) {
			if (Math.abs(this.y - player.y) > 2) {
				yo = this.angrySpeed * (this.y < player.y ? 1 : -1);
			} else if (Math.abs(this.x - player.x) > 5) {
				this.dir = this.x < player.x ? 1 : -1;
				xo = this.angrySpeed * this.dir;
			}
		}
		yo += Math.sin(Date.now() / 100) / 2;

	}

	if (this.knockBack !== 0) {
		xo += this.knockBack;
		this.knockBack = this.knockBack + (this.knockBack > 0 ? -1 : 1);
	}


	if (!this.isAngry) {
		// Don't move if not visible - save coll detection on map
		if (this.visible) {
			this.move(xo, yo, map);
		}
	} else {
		this.x += xo;
		this.y += yo;
		if (this.visible) {
			this.foreverAngry = true;
		}
	}

	return !(this.remove);
};
Ghoul.prototype.hitBlocks = function (x, y) {
	this.dir *= -1;
};
Ghoul.prototype.render = function (c) {

	c.strokeStyle = "#000";
	c.lineWidth = 2;

	c.shadowColor =  "hsl(70, 100%, 50%)";
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur    = 10;

	c.fillStyle = this.isAngry ? "hsl(10, 80%, 60%)" : "hsl(180, 80%, 50%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);


	c.fillStyle = this.isAngry ? "hsl(0, 80%, 60%)" : "hsl(120, 30%, 40%)";
	c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);

	c.fillStyle = this.isAngry ? "hsl(0, 80%, 60%)" : "hsl(120, 30%, 40%)";
	c.fillRect(this.x + 2, this.y +20, 8, 3);
	c.strokeRect(this.x + 2, this.y +20, 8, 3);
	c.fillRect(this.x + 4, this.y + 11, 3, 5);


};