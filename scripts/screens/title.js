window.Screen = window.Screen || {};
Screen.title = {

	init: function () {
		this.ticks = 0;
		this.tiles = Sheet(game.res.tiles, game.tw, game.th);
	},

	tick: function () {
		this.ticks++;
	},

	render: function (c) {

		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);

		this.tiles.render(c, 2, 0, 20, 20);
		this.tiles.render(c, 3, 0, 20 + game.tw, 20);

	}

};
