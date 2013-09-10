var Pickup = function (){
	this.w = 20;
	this.h = 24;
};
Pickup.prototype = new Entity;
Pickup.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	return this;
}
Pickup.prototype.tick = function (map) {
	return !(this.remove);
};
Pickup.prototype.hit = function (e) {};
Pickup.prototype.render = function (c) {
	c.strokeStyle = "#000";
	c.fillStyle = "#a00";
	c.beginPath();
	c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w /3, 0, Math.PI * 2, false);
	c.fill();
	c.stroke();

};

