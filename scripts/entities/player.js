var Player = function() {
	this.w = 17;
	this.h = 24;
};
Player.prototype = new Entity;
Player.prototype.tick = function (input, map) {

	if (input.isDown("up")) {
		this.yo -= 3;
	}
	if (input.isDown("down")) {
		this.yo += 3;
	}
	if (input.isDown("left")) {
		this.xo -= 3;
	}
	if (input.isDown("right")) {
		this.xo += 3;
	}

	this.move(this.xo, this.yo, map);

}
