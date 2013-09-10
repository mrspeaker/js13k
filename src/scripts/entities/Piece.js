var Piece = function (){
	this.w = 20;
	this.h = 24;
};
Piece.prototype = new Entity;
Piece.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	return this;
}
Piece.prototype.tick = function (map) {
	return !(this.remove);
};
Piece.prototype.hit = function (e) {};
Piece.prototype.render = function (c) {
	c.strokeStyle = "#000";
	c.fillStyle = "#a00";
	c.beginPath();
	c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w /3, 0, Math.PI * 2, false);
	c.fill();
	c.stroke();

};

