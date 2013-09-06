var Player = function() {
	this.w = 12;
	this.h = 23;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
};
Player.prototype = new Entity;
Player.prototype.tick = function (input, map) {

	var speed = 0.9;

	if (input.isDown("up")) {
		if (!this.falling) {
			this.acc[1] = -map.sheet.h - 1;
			this.vel[1] = 0;
			this.falling = true
		}
	}
	if (input.isDown("down")) {
		this.acc[1] += speed;
	}
	if (input.isDown("left")) {
		this.acc[0] -= speed;
	}
	if (input.isDown("right")) {
		this.acc[0] += speed;
	}

	this.tickVelocity();
	this.move(this.xo, this.yo, map);

};
Player.prototype.tickVelocity = function () {
	this.grav = this.falling ? this.grav + 0.25 : 0;
	this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1] + this.grav];
	this.vel = [this.vel[0] * this.friction, this.vel[1] * this.friction];

	this.acc = [0, 0];

	if (Math.abs(this.vel[0]) < 0.01) this.vel[0] = 0;
	if (Math.abs(this.vel[1]) < 0.01) this.vel[1] = 0;

	this.xo += this.vel[0];
	this.yo += this.vel[1];
};