window.Screen = window.Screen || {};
Screen.title = {

	init: function () {
		this.ticks = 0;
		this.tiles = makeSheet(game.res.tiles, game.tw, game.th);
		this.camera = Camera.init(game.ctx.w, game.ctx.h);
		this.map = Map.init(this.tiles, this.camera);

		this.player = Player.init(100, 100);

		return this;
	},

	tick: function (input) {
		this.player.tick(input, this.map);
		this.map.tick();

	},

	render: function (c) {

		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);

		this.camera.render(c, [this.map, this.player]);

	}

};

