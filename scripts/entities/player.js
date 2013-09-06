var Player = {

	x:0,
	y:0,
	w: 15,
	h: 32,

	init: function (x, y) {

		this.x = x;
		this.y = y;

		return this;

	},

	reset: function () {

	},

	tick: function (input, map) {

		if (input.isDown("up")) {
			this.y -= 3;
		}
		if (input.isDown("down")) {
			this.y += 3;
		}
		if (input.isDown("left")) {
			this.x -= 3;
		}
		if (input.isDown("right")) {
			this.x += 3;
		}


	},

	render: function (c) {

		c.fillStyle = "red";
		c.fillRect(this.x, this.y, this.w, this.h);

	}

};
