window.Screen = window.Screen || {};
Screen.title = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(100, 100);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.ghoul = new Ghoul().init(200, 200);

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghoul.tick();
	},

	render: function (c) {

		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);

		this.camera.render(c, [this.map, this.ghoul, this.player]);

	}

};

