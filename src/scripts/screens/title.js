window.Screen = window.Screen || {};
Screen.title = {

	init: function () {
		return this;
	},

	tick: function (input) {

	},

	render: function (c) {
		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);
	}

};

