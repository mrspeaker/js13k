window.Screen = window.Screen || {};
Screen.title = {

	count: 0,

	init: function () {
		return this;
	},

	tick: function (input) {

		this.count++;

		if (this.count > 50 && input.pressed("fire")) {
			game.setScreen(Screen.level);
		}

	},

	render: function (c) {
		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		game.res.font(c, "JS13K BY MRSPEAKER", 140, 160);
	}

};
