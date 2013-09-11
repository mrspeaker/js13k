window.Screen = window.Screen || {};
Screen.level = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(100, 100, this);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.pickups = this.map.pickups.map(function (p) {
			return new Pickup().init(p[0] * game.tw, p[1] * game.th)
		});
		this.pieces = this.map.pieces.map(function (p, i) {
			return new Piece().init(p[0] * game.tw, p[1] * game.th, i)
		});
		this.ghouls = [];

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghouls = this.ghouls.filter(function (g) {
			return g.tick(this.map);
		}, this);
		this.pickups = this.pickups.filter(function (p) {
			return p.tick();
		});
		this.pieces = this.pieces.filter(function (p) {
			return p.tick();
		});

		if (Math.random() < 0.01 && this.ghouls.length < 35) {
			var empty = false,
				x,
				y;
			while (!empty) {
				x = Math.random() * (this.map.cellW - 4) | 0;
				y = (Math.random() * (this.map.cellH - 4) | 0) + 2;
				empty = true;
				for (var i = 0; i < 4; i++) {
					if (this.map.cells[y][x + i] > this.map.walkable ||
						this.map.cells[y - 1][x + i] > this.map.walkable ||
						this.map.cells[y + 1][x + i] > this.map.walkable ) {
						empty = false;
						break;
					}
				}
			}
			this.ghouls.push(
				new Ghoul().init((x + 1) * game.tw, y * game.th, Math.random() < 0.5 ? 1 : -1)
			)
		}

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollisions([this.ghouls, this.player.traps]);
		utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
		utils.checkCollision(this.player, this.pieces);
		utils.checkCollision(this.player, this.pickups);
		utils.checkCollision(this.player, this.ghouls);
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

		game.res.font(c, "GRAIL: " + this.player.complete() + "/4", 20, 20);
		game.res.font(c, "XP: " + this.player.numTraps, 20, 40);
		game.res.font(c, "TRAPS: " + this.player.numTraps, 20, 60);


	}
};
