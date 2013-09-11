window.Screen = window.Screen || {};
Screen.level = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(100, 100);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.pickups = this.map.pickups.map(function (p) {
			return new Pickup().init(p[0] * game.tw, p[1] * game.th)
		});
		this.pieces = this.map.pieces.map(function (p, i) {
			return new Piece().init(p[0] * game.tw, p[1] * game.th, i)
		});
		this.ghouls = [
			new Ghoul().init(200, 285)
		];

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghouls = this.ghouls.filter(function (g) {
			return g.tick();
		});
		this.pickups = this.pickups.filter(function (p) {
			return p.tick();
		});
		this.pieces = this.pieces.filter(function (p) {
			return p.tick();
		});

		if (Math.random() < 0.01 && this.ghouls.length < 15) {
			this.ghouls.push(
				new Ghoul().init(5, [110, 280, 420][Math.random() * 3 | 0], 1)
			)
		}

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollisions([this.ghouls, this.player.traps]);
		utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
		utils.checkCollision(this.player, this.pieces);
		utils.checkCollision(this.player, this.pickups);
	},

	render: function (c) {

		c.clearRect(0, 0, c.w, c.h);

		this.camera.render(c, [
			this.map,
			this.pickups,
			this.pieces,
			this.ghouls,
			this.player
		]);

		game.res.font(c, "TRAPS: " + this.player.numTraps, 20, 20)

	}
};
