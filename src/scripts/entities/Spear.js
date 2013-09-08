var Spear = function (){
	this.w = 15;
	this.h = 4;
	this.speed = 8;
	this.dir = -1;
	this.life = 200;
	this.falling = false;
	this.remove = false;
	this.stuck = false;
	this.x = 0;
	this.y = 0;
};
Spear.prototype = new Entity;
Spear.prototype.init = function (x, y, dir) {
	this.x = x;
	this.y = y;
	this.dir = dir;

	return this;
}
Spear.prototype.tick = function (map) {
	if (!this.stuck) {
		var speed = this.speed * this.dir,
			moved = this.move(speed, this.yo, map);
		if (moved[0] === 0) {
			this.stuck = true;
		}
	}

	if (this.life-- < 0) {
		this.remove = true;
	}

	return !(this.remove);
};
Spear.prototype.hit = function (e) {

	if (!(e instanceof Spear)) {
		//e.remove = true;
		this.remove = true;
	} else {
		//e.stuck = true;
		this.stuck = true;
	}
};
Spear.prototype.render = function (c) {
	c.fillStyle = "#ff0";
	c.strokeStyle = "#000";
	c.lineWidth = 1;
	c.fillRect(this.x, this.y + 1, this.w, this.h - 2);
	c.fillRect(this.x + (this.dir < 0 ? 10 : this.w - 12), this.y, 2, this.h);
	c.strokeRect(this.x - 1, this.y, this.w + 2, this.h);


};

