(function (Screen) {

	Screen.win = {

		count: 0,

		init: function (xp) {
			this.tiles = makeSheet(game.res.tiles, game.tw, game.th);
			this.xp = xp || 0;

			audio.sfx.collect();

			return this;
		},

		tick: function (input) {
			this.count++;

			if (this.count > 50 && input.pressed("fire")) {
				game.reset();
			}

		},

		render: function (c) {
			c.fillStyle = "hsl(" + ((this.count + 80) / 3 % 360 | 0) + ", 60%, 40%)";
			c.fillRect(0, 0, c.w, c.h);

			c.save();
			c.scale(3, 3);

			for (var i = 0; i < 12; i++) {
				this.tiles.render(c, 5, 0, i * game.tw, 100);
				for (var j = 0; j < 5; j++) {
					this.tiles.render(c, 7, 0, i * game.tw, game.th * (j + 1) + 100);
				}
			}

			game.res.font(c, "KING GLOWBOUG", 15 + Math.sin(Date.now() / 300) * 5, 10 + Math.cos(Date.now() / 200) * 2);

			c.restore();

			game.res.font(c, "YOU HAVE SAVED THE DAY AND DONE WELL.", 50, 140);
			game.res.font(c, "RECLAIMING THE GRAIL'S ENERGY GAVE YOU", 50, 170);
			game.res.font(c, this.xp + " YEARS OF REWARD.", 50, 200);
			game.res.font(c, "PLUS IT WAS QUITE FUN.", 50, 260);
		}

	};

}(window.Screen || {}));
