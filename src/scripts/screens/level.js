window.Screen = window.Screen || {};
Screen.level = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(game.tw * 2, game.th * 5, this);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.pickups = this.map.pickups.map(function (p) {
			return new Pickup().init(p[0] * game.tw, p[1] * game.th)
		});
		this.pieces = this.map.pieces.map(function (p, i) {
			return new Piece().init(p[0] * game.tw, p[1] * game.th, i)
		});
		this.ghouls = [];

		this.particles = [];

		for (var i = 0; i < 5; i++) {
			this.particles.push(
				new Particle().init({})
			)
		}

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
		this.particles.forEach(function (p) {
			return p.tick();
		});

		// Generate a ghoul
		if (Math.random() < 0.01 && this.ghouls.length < 35) {
			var empty = false,
				x,
				y;
			while (!empty) {
				x = Math.random() * (this.map.cellW - 4) | 0;
				y = (Math.random() * (this.map.cellH - 4 - 7) | 0) + 2 + 7;

				var dist = utils.dist([this.player.x, this.player.y], [x * game.tw, y * game.th]);

				if (dist < (5 - this.player.complete()) * 600) {
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
			}
			this.ghouls.push(
				new Ghoul().init((x + 1) * game.tw, y * game.th, Math.random() < 0.5 ? 1 : -1, this)
			)
			// Random based on completeness that ghost is angry
			if (Math.random() < 0.4 * ((this.player.complete() + 1) / 4)) {
				this.ghouls[this.ghouls.length - 1].isAngry = true;
			}
		}

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollisions([this.ghouls, this.player.traps]);

		if (!this.player.deaded) {
			utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
			utils.checkCollision(this.player, this.pieces);
			utils.checkCollision(this.player, this.pickups);
			utils.checkCollision(this.player, this.ghouls);
		}
	},


	xp: function (e) {

		this.player.xp += e.xpValue;

	},

	explode: function (x, y) {

		var played = false;
		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			if (!p.running) {
				p.play(x, y);
				played = true;
			}
			break;
		}

		if (!played) {
			this.particles[0].play(x, y);
		}

		audio.sfx.die();

	},

	firstPickup: function () {
		game.dialog = new Dialog().init(function (c) {
			game.res.font(c, "HOLD DOWN AND FIRE TO ACTIVATE A", 40, 60);
			game.res.font(c, "GLOWBOUG TRAP.", 40, 100);
			game.res.font(c, "IT HAS A SHORT RANGE, SO BE CLOSE!", 40, 170);
			game.res.font(c, "TRY TO CATCH THEM FROM BELOW.", 40, 210);
			game.res.font(c, "GLOWBOUGS WILL LEAD YOU TO THE GRAIL.", 40, 250);
		});
	},

	firstPiece: function () {
		game.dialog = new Dialog().init(function (c) {
			game.res.font(c, "YOU HAVE FOUND A PIECE OF THE GRAIL.", 40, 60);
			game.res.font(c, "FIND THE REMAINING THREE PIECES TO", 40, 120);
			game.res.font(c, "COMPLETE YOUR QUEST.", 40, 150);

			game.res.font(c, "YOU WILL NOW RETURN HERE, IF YOU DIE.", 40, 220);
		});
	},

	winsTheGame: function () {

		game.setScreen(Screen.win, this.player.xp);

		// game.dialog = new Dialog().init(function (c) {
		// 	game.res.font(c, "YOU HAVE DISCOVERED THE LAST PIECE.", 40, 60);
		// 	game.res.font(c, "IT'S BEAUUTIFUL.", 40, 120);
		// 	game.res.font(c, "YOUR QUEST IS COMPLETE.", 40, 150);
		// }, function () {
		// 	game.reset();
		// });
	},

	render: function (c) {

		c.clearRect(0, 0, c.w, c.h);

		this.camera.render(c, [
			this.map,
			this.pickups,
			this.pieces,
			this.ghouls,
			this.player,
			this.particles
		]);

		game.res.font(c, "GRAIL: " + this.player.complete() + "/4", 20, 20);
		game.res.font(c, "XP: " + this.player.xp, 20, 40);
		game.res.font(c, "TRAPS: " + this.player.numTraps, 20, 60);


	}
};
