var Trap = function (){
	this.w = 20;
	this.h = 48;
	this.x = 0;
	this.y = 0;
	this.life = 5;
	this.closest = null;
	this.activated = false;
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
		this.activated = true;
		if (--this.life === 0) {
			this.remove = true;
		}
	}
};
Trap.prototype.setClosestPiece = function (pieces) {
	var self = this;
	this.closest = pieces.reduce(function (acc, p) {
		var dist = utils.dist([self.x, self.y], [p.x, p.y]),
			angle = utils.angleBetween(self, p);

		angle %= Math.PI * 2;
   		if (angle < 0) angle += Math.PI * 2;

		if (!acc[0] || dist < acc[1]) {
			return [p, dist, angle];
		}
		return acc;
	}, [null, -1, -1]);
};
Trap.prototype.render = function (c) {

	if (this.activated && this.closest[0]) {
		c.save();
		c.translate(this.x + this.w / 2, this.y + this.h / 2);
		c.rotate(this.closest[2] + Math.PI * 1.5);
		c.fillStyle = "hsl(40, 50%, 10%)";
		c.strokeStyle = "#ff0";
		c.beginPath();
		c.moveTo(-5, 0);
		c.lineTo(5, 0);
		c.lineTo(0, -13);
		c.fill();
		c.stroke();

		c.beginPath();
		c.arc(0, 0, 5, 0, Math.PI * 2, true);
		c.fill();
		c.restore();
	}

	var grd = c.createLinearGradient(this.x + 10, this.y, this.x + 10, this.y + this.h);
	grd.addColorStop(0, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(Math.random() * 0.3, "hsla(0, 0%, 0%, 0)");
	grd.addColorStop(1, "hsla(" + (Math.random() * 20 + 40 | 0) +", 100%, 50%, " + (this.life / 5) + ")");
	c.fillStyle = grd;
	c.fillRect(this.x, this.y, this.w, this.h);

	c.fillStyle = "#a00";
	c.fillRect(this.x, this.y + this.h - 3, this.w, 3);


};

