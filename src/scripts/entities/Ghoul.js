var Ghoul = function () {
	this.w = 15;
	this.h = 22;
};
Ghoul.prototype = new Entity;
Ghoul.prototype.hit = function () {
	this.remove = true;
};
