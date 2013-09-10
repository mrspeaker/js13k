var Ghoul = function () {
	this.w = 15;
	this.h = 22;
	this.dir = 1;
	this.speed = 3;
	this.life = 3;
};
Ghoul.prototype = new Entity;
Ghoul.prototype.init = function (x, y, dir) {
	this.x = x;
	this.y = y;

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
		if(this.life-- <= 0) {
			this.remove = true;
		}
	}
	if (e instanceof Trap) {
		this.remove = true;
	}
};
Ghoul.prototype.tick = function () {
	this.y += Math.sin(Date.now() / 100);
	this.x += this.speed * this.dir;

	if (this.x < 0 || this.x > game.ctx.w) {
		//this.remove = true;
		this.dir *= -1;
	}
	return !(this.remove);
};
Ghoul.prototype.render = function (c) {

	c.strokeStyle = "hsl(70, 100%, 50%)";

	c.shadowColor =  "hsl(70, 100%, 50%)";
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur    = 10;

	c.fillStyle = "hsl(180, 80%, 50%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	//c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(120, 30%, 40%)";
	c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	//c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);

	c.fillStyle = "hsl(120, 40%, 50%)";
	c.fillRect(this.x + 2, this.y +20, 8, 3);

	c.fillRect(this.x + 4, this.y + 11, 3, 5);

};