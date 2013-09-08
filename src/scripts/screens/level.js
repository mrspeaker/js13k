window.Screen = window.Screen || {};
Screen.level = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(100, 100);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.ghouls = [
			new Ghoul().init(200, 280)
		];

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghouls = this.ghouls.filter(function (g) {
			return g.tick();
		});

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
	},

	render: function (c) {

		//c.fillStyle = "#000";
		c.clearRect(0, 0, c.w, c.h);

		var grd = c.createLinearGradient(0, 0, 0, c.h);
	      // light blue
	      grd.addColorStop(0, 'hsl(30, 50%, 25%)');
	      // dark blue
	      grd.addColorStop(1, 'hsl(20, 50%, 00%)');
	      c.fillStyle = grd;
	   //   c.fillRect(0, 0, c.w, c.h);


		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);

		this.camera.render(c, [this.map, this.ghouls, this.player]);

	}
};
