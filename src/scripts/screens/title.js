window.Screen = window.Screen || {};
Screen.title = {

	count: 0,

	init: function () {
		this.tiles = makeSheet(game.res.tiles, game.tw, game.th);
		return this;
	},

	tick: function (input) {

		this.count++;

		if (this.count > 50 && input.pressed("fire")) {
			game.setScreen(Screen.level);
		}

	},

	render: function (c) {

		c.clearRect(0, 0, c.w, c.h);
		c.save();
		c.scale(3, 3);

		for (var i = 0; i < 12; i++) {
			this.tiles.render(c, 5, 0, i * game.tw, 100);
			for (var j = 0; j < 5; j++) {
				this.tiles.render(c, 7, 0, i * game.tw, game.th * (j + 1) + 100);
			}
		}

		game.res.font(c, "GLOWBOUGS", 15 + Math.sin(Date.now() / 300) * 5, 10 + Math.cos(Date.now() / 200) * 2);
		game.res.font(c, "BY", 10, 40);
		game.res.font(c, "MR SPEAKER", 10, 70);


		c.restore();
	}

};
