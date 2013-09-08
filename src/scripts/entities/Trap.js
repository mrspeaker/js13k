var Trap = function (){
	this.w = 20;
	this.h = 48;
	this.x = 0;
	this.y = 0;
	this.life = 5;
};
Trap.prototype = new Entity;
Trap.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	return this;
}
Trap.prototype.tick = function (map) {
	return !(this.remove);
};
Trap.prototype.hit = function (e) {

	if (e instanceof Ghoul) {
		if (--this.life === 0) {
			this.remove = true;
		}

	}

};
Trap.prototype.render = function (c) {
	//c.fillStyle = "hsla(55, 100%, 50%, " + (this.life / 5) + ")";

	var grd = c.createLinearGradient(this.x + 10, this.y, this.x + 10, this.y + this.h);
	grd.addColorStop(0, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(Math.random() * 0.3, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(1, "hsla(" + (Math.random() * 20 + 40 | 0) +", 100%, 50%, " + (this.life / 5) + ")");
	c.fillStyle = grd;
	c.fillRect(this.x, this.y, this.w, this.h);

	c.fillStyle = "#a00";
	c.fillRect(this.x, this.y + this.h - 3, this.w, 3);
};

